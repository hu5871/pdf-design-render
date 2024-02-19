import { Canvas } from "../canvas";
import { CursorType, PDF_Element, PDF_Render_Element, Point, Rect, Position, ShapeType, Shape } from "../types";
import Component from "../components";
import Events from "../events";
import isPointPath, { transformRotate } from "../utils/isPointPath";
import BaseCommon from "../components/common";
import { normalizeRect } from "../utils/calc";
import { ResizeDirection } from "../control/resize";

let pdf_id = 0
export class Render extends Canvas {
  ins: Canvas;
  elements: PDF_Render_Element[];
  ctx: CanvasRenderingContext2D
  events: Events;
  startX: number;
  startY: number;
  down: boolean;
  renderMap: Map<PDF_Render_Element["_id"], Shape>
  item: PDF_Render_Element | undefined
  index: number
  dirRect: ResizeDirection | undefined;
  isRotating: boolean;
  rateItem: Rect | null;
  startRect: Rect | null

  constructor(width: number, height: number, elements: PDF_Element[]) {
    super({ width, height })
    this.renderMap = new Map()
    this.elements = elements.map(item => ({ ...item, _id: ++pdf_id, _active: false }));
    this.ctx = this.canvasIns!._ctx;
    this.events = new Events(this.ctx, this.handleEvent.bind(this))
    this.ins = this.canvasIns

    this.createElements()
    this.events.init(this.ins!._canvas!)
    // 拖动逻辑
    this.down = false
    // 按下后矩形内的坐标：x,y
    this.startX = 0
    this.startY = 0
    this.startRect = null
    this.item = undefined
    this.index = -1
    this.rateItem = null

    // 缩放
    this.dirRect = undefined
    this.isRotating = false
  }
  get elementsList() {
    return this.elements
  }
  createElements() {
    this.clear(this.ins)
    const elements = [...this.elements]
    while (elements.length) {
      const item = elements.shift()
      item && this.renderItem(item)
    }
  }
  getCanvasPoint(e: MouseEvent): { x: number, y: number } {
    const screenX = e.clientX; // 鼠标事件的屏幕X坐标
    const screenY = e.clientY; // 鼠标事件的屏幕Y坐标
    const canvasRect = this.ins!._canvas!.getBoundingClientRect(); // 获取Canvas元素在页面上的位置
    const x = screenX - canvasRect.left; // 相对于Canvas元素的X坐标
    const y = screenY - canvasRect.top; // 相对于Canvas元素的Y坐标
    return {
      x,
      y
    }
  }
  handleEvent(e: any) {
    const type = e.type
    switch (type) {
      case "mousedown":
        const { x, y } = this.getCanvasPoint(e)
        this.down = true
        if(this.item && this.index >= 0){
            const { left: x = 0, top: y = 0, width = 0, height = 0, angle = 0 } = this.elements[this.index].style!
            this.startRect = {
              x, y, width, height, angle
            };
        }
        // 如果点击控制圆点
        if (this.item && this.down) {
          const rect = this.renderMap.get(this.item!._id)!.controlManage.isHit({ x, y }, "size")
          console.log(rect)
          if (rect) {
            this.dirRect = rect.type
            this.setCursorStyle(CursorType.Default, 0)
          }
          if (this.dirRect) return
        }

        // 如果点击旋转区域
        if (this.item) {
          // 控制类实例
          let rect = this.renderMap.get(this.item!._id)?.controlManage.isHit({ x, y }, "rotate")
          if (rect) {
            // 设置鼠标样式
            this.setCursorStyle(CursorType.Rotation, rect.angle || 0)
            // 标记控制状态
            this.isRotating = true
            // 开始旋转
            const item = this.renderMap.get(this.item!._id)!
            const {cx,cy} = item.getCenterPoint()
            item.controlManage.rotate.startRota({ x, y },{x:cx,y:cy})
            return
          }
          else this.setCursorStyle(CursorType.Default, 0)
        }


        // 选中图形
        let index = this.elements.findIndex(item => {
          return isPointPath(this.renderMap.get(item._id), { x, y }, this.renderMap.get(item._id)!.shapeType)
        })
        this.item = index !== -1 ? this.elements[index] : undefined
        this.index = index
        const { left = 0, top = 0 } = this.item?.style || {}
        if (this.item) {
          this.elements.forEach(item => item._active = false);
          [this.startX, this.startY, this.elements[index]._active] = [x - left, y - top, true];
        }
        else[this.startX, this.startY, this.down, this.dirRect] = [0, 0, false, undefined, this.elements.forEach(item => item._active = false)];
        window.requestAnimationFrame(this.createElements.bind(this))
        break
      case "mousemove":
        {
          const { startX, startY } = this
          const { x, y } = this.getCanvasPoint(e)
          // 缩放
          if (this.dirRect && this.item) {
            this.updateScale({ x: x - startX, y: y - startY })
            window.requestAnimationFrame(this.createElements.bind(this))
            return
          }
          if (this.isRotating && this.item && this.down) {
            const item = this.renderMap.get(this.item!._id)!
            const {cx,cy} = item.getCenterPoint()
            const angle=item.controlManage.rotate.rotating({ x, y },{x:cx,y:cy},this.startRect?.angle??0)
            this.elements[this.index].style!.angle=angle
            window.requestAnimationFrame(this.createElements.bind(this))
            return
          }
          // 移入设置旋转光标
          if (!this.down && this.item) {
            let rect = this.renderMap.get(this.item!._id)?.controlManage.isHit({ x, y }, "rotate")
            if (rect) {
              this.setCursorStyle(CursorType.Rotation, rect.angle || 0)
            }
            else this.setCursorStyle(CursorType.Default, 0)
          }

          // 拖拽
          if (this.down && this.item) {
            //更改坐标
            if ((x - startX)! > 0) this.elements[this.index].style!.left = x - startX
            if ((y - startY)! > 0) this.elements[this.index].style!.top = y - startY
            window.requestAnimationFrame(this.createElements.bind(this))
          }
        }
        break;
      case "mouseup":
        if (!this.item?._id) return
        {
          [this.startX, this.startY, this.down, this.dirRect, this.isRotating] = [0, 0, false, undefined, false]
        }

        break;
      default:
        break;
    }
  }
  updateItemAttrs(rect:Rect){
    const {x,y,width,height,angle}=rect
    this.elements[this.index].style!.left = x
    this.elements[this.index].style!.width = width
    this.elements[this.index].style!.top = y
    this.elements[this.index].style!.height = height
    this.elements[this.index].style!.angle = angle
  }

  updateScale(point: Point) {
    if (!this.dirRect) return
    const dirRect = this.dirRect
    if (!this.startRect) return
    const retRect = this.renderMap.get(this.item!._id)?.controlManage.resize.calc(this.startRect, point, dirRect)
    if (!retRect) return
    this.updateItemAttrs(retRect)
  }


  renderItem(item: PDF_Render_Element) {
    if (Reflect.ownKeys(item.style as Object).length === 0) {
      item.style = {}
    }
    if (Reflect.ownKeys(item.props as Object).length === 0) {
      item.props = {}
    }

    // 如果不存在则创建
    if (!this.renderMap.has(item._id)) {
      let render = new Component[item.type](item.style!, item.props!)
      render.draw(this.ctx)
      this.renderMap.set(item._id, render)
      return
    }

    // 复用class
    const render = this.renderMap.get(item._id)!
    // 更新位移参数
    render.update(item.style!, item.props!, item._active)
    render.draw(this.ctx)
  }
}