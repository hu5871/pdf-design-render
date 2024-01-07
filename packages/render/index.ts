import { Canvas } from "../canvas";
import { PDF_Render_Element, Point, PointRect, Position, ShapeType } from "../types";
import Component from "../components";
import Events from "../events";
import isPointPath from "../utils/isPointPath";

let pdf_id = 0
export class Render extends Canvas {
  ins: Canvas;
  elements: PDF_Render_Element[];
  ctx: CanvasRenderingContext2D
  events: Events;
  startX: number;
  startY: number;
  down: boolean;
  renderMap: Map<PDF_Render_Element["_id"], any>
  item: PDF_Render_Element | undefined
  index: number
  dirRect: Position | null;

  constructor(canvasIns: Canvas, width: number, height: number, ratio: number) {
    super({ width, height, element: canvasIns.element })
    this.renderMap = new Map()
    this.elements = canvasIns.element.map(item => ({ ...item, _id: ++pdf_id, _active: false }));
    this.ctx = canvasIns!._ctx;
    this.events = new Events(this.ctx, this.handleEvent.bind(this))
    this.ins = canvasIns

    this.createElements()
    this.events.init(this.ins!._canvas!)
    // 拖动逻辑
    this.down = false
    // 按下后矩形内的坐标：x,y
    this.startX = 0
    this.startY = 0
    this.item = undefined
    this.index = -1

    // 缩放
    this.dirRect = null
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
        if (this.item) {
          //获取某个方向的圆点
          const { rects,rectMap } = this.renderMap.get(this.item!._id)
          if (rects.length) {
            for (const [key, value] of rectMap) {
              // 点击命中
              const isHit= isPointPath(key, { x, y }, ShapeType.Circle)
              if(isHit) {
                this.dirRect = value
                break
              }
            }
          }
          if (this.dirRect) return
        }
        let index = this.elements.findIndex(item => isPointPath(this.renderMap.get(item._id), { x, y }, this.renderMap.get(item._id).shapeType))
        this.item = index !== -1 ? this.elements[index] : undefined
        this.index = index
        const { left = 0, top = 0 } = this.item?.style || {}
        if (this.item) {
          this.elements.forEach(item => item._active = false);
          [this.startX, this.startY, this.down, this.elements[index]._active] = [x - left, y - top, true, true];
        }
        else[this.startX, this.startY, this.down, this.dirRect] = [0, 0, false, null, this.elements.forEach(item => item._active = false)];
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
          const {left = 0,top = 0,width= 0 ,height = 0} =this.elements[this.index].style!
          // 如果图形被反转了，width和height肯定是负的，转正数，并且设置x和y
          if(width < 0){
            this.elements[this.index].style!.left= (left + width )
            this.elements[this.index].style!.width= Math.abs(width)
          }
          if(height < 0) {
            this.elements[this.index].style!.top= (top + height )
            this.elements[this.index].style!.height= Math.abs(height)
          }
          window.requestAnimationFrame(this.createElements.bind(this))
        }
        {
          [this.startX, this.startY, this.down, this.dirRect,] = [0, 0, false, null,]
        }
       
        break;
      default:
        break;
    }
  }

  updateScale(point: Point) {
    const { startX, startY } = this
    const x = (point.x - startX);
    const y = (point.y - startY);
    const { left = 0, top = 0, width = 0, height = 0 } = this.elements[this.index].style!
    const dirRect = this.dirRect!
    switch ( dirRect) {
      case "top:left":
        this.elements[this.index].style!.left = x
        this.elements[this.index].style!.width = width + (left - x)
        this.elements[this.index].style!.top = y
        this.elements[this.index].style!.height = height +(top - y)
        break;
      case "top:center":
        break;
      case "top:right":
        console.log("top:right")
        break;
      case "center:left":
        // 如果拖动的距离大于等于矩形右侧边界
        // if(x >= left + width) return 
        const newLeft =x
        const newWidth = width + (left - x)
        this.elements[this.index].style!.left = newLeft
        this.elements[this.index].style!.width =newWidth
        break;
      case "center:right":
        // 如果拖动的距离大于等于矩形左边侧边界
        if(x <= left) return 
        this.elements[this.index].style!.width = x - left
        break;
      case "bottom:left":
        break;
      case "bottom:center":
        break;
      case "bottom:right":
        break;
      default:
        return
    }
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
    const render = this.renderMap.get(item._id)
    // 更新位移参数
    render.update(item.style!, item.props!, item._active)
    render.draw(this.ctx)
  }
}