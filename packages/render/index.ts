import { Canvas } from "../canvas";
import { PDF_Render_Element } from "../types";
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
        const index = this.elements.findIndex(item => isPointPath(this.renderMap.get(item._id),{ x, y },this.renderMap.get(item._id).shapeType))
        this.item = index !== -1 ? this.elements[index] : undefined
        this.index = index
        const { left = 0, top = 0 } = this.item?.style || {}
        //如果点击的是缩放圆点、圆点部分在矩形外边，不能在item内判断

        // to do 判断圆点
        if (this.item) {
          this.elements.forEach(item => item._active = false);
          [this.startX, this.startY, this.down, this.elements[index]._active] = [x - left, y - top, true, true];
        }
        else [this.startX, this.startY, this.down] = [0, 0, false,this.elements.forEach(item => item._active = false)];
        window.requestAnimationFrame(this.createElements.bind(this))
        break
      case "mousemove":
        if (this.down && this.item) {

          const { startX, startY } = this
          const screenX = e.clientX; // 鼠标事件的屏幕X坐标
          const screenY = e.clientY; // 鼠标事件的屏幕Y坐标
          const canvasRect = this.ins!._canvas!.getBoundingClientRect(); // 获取Canvas元素在页面上的位置
          const canvasX = (screenX - canvasRect.left) - startX; // 相对于Canvas元素的X坐标
          const canvasY = (screenY - canvasRect.top) - startY; // 相对于Canvas元素的Y坐标
          //更改坐标
          if ((canvasX)! > 0) this.elements[this.index].style!.left = canvasX
          if ((canvasY)! > 0) this.elements[this.index].style!.top = canvasY

          this.clear(this.ins!)
          window.requestAnimationFrame(this.createElements.bind(this))
        }
        break;
      case "mouseup":
        if (!this.item?._id) return
        [this.item, this.index] = [undefined, -1];
        [this.startX, this.startY, this.down] = [0, 0, false]

        break;
      default:
        break;
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
    render.draw(this.ctx,)
    // this.events.addEvent(render, item.on || {}, item)
  }
}