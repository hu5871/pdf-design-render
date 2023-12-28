import { Canvas } from "../canvas";
import { PDF_Element, PDF_Render_Element, RenderType } from "../types";
import Component from "../components/indext";
import Events from "../events";

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
    this.elements = canvasIns.element.map(item => ({ ...item, _id: ++pdf_id }));
    this.ctx = canvasIns!._ctx;
    this.events = new Events(this.ctx, this.handleEvent.bind(this))
    this.ins = canvasIns
    this.clear(canvasIns)
    this.createElements()
    // 拖动逻辑
    this.down = false
    this.startX = 0
    this.startY = 0
    this.item = undefined
    this.index = -1
  }
  createElements() {
    const elements = [...this.elements]
    while (elements.length) {
      const item = elements.shift()
      item && this.renderItem(item)
    }
    this.events.init(this.ins!._canvas!)

  }
  handleEvent(e: any) {
    const type = e.type
    switch (type) {
      case "mousedown":
        const index = this.elements.findIndex(item => this.renderMap.get(item._id).isPointRect(e))
        this.item = index !== -1 ? this.elements[index] : undefined
        this.index = index
        if (this.item) return [this.startX, this.startY, this.down] = [e.x, e.y, true]
        else[this.startX, this.startY, this.down] = [0, 0, false];
        break
      case "mousemove":
        if (this.down && this.item) {
          const screenX = e.clientX; // 鼠标事件的屏幕X坐标
          const screenY = e.clientY; // 鼠标事件的屏幕Y坐标
          const canvasRect = this.ins!._canvas!.getBoundingClientRect(); // 获取Canvas元素在页面上的位置
          const canvasX = screenX - canvasRect.left; // 相对于Canvas元素的X坐标
          const canvasY = screenY - canvasRect.top; // 相对于Canvas元素的Y坐标
          //更改坐标
          this.elements[this.index].style!.left = canvasX
          this.elements[this.index].style!.top = canvasY
          this.clear(this.ins!)
          window.requestAnimationFrame(this.renderItem.bind(this, this.item))
        }
        break;
      case "mouseup":
        // console.log(this.startX,this.startY)
        this.down = false
        this.item = undefined
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
    const render=this.renderMap.get(item._id)
    render.update(item.style!, item.props!)
    render.draw(this.ctx)
    // this.events.addEvent(render, item.on || {}, item)
  }
}