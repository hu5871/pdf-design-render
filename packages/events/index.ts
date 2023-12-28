import { PDF_Element, RenderType } from "../types"

export default class Events {
  ctx: CanvasRenderingContext2D
  stack: Record<string,any>[]
  eventHandler: any
  callBack: (key: string, e: any,item:PDF_Element,ins:any) => void
  constructor(ctx: CanvasRenderingContext2D,callBack:(e:any)=>void) {
    this.ctx = ctx
    // this.stack = []
    this.eventHandler =callBack
    // this.callBack=callBack
  }
  init(canvas:HTMLCanvasElement) {
    canvas.removeEventListener('click', this.eventHandler)
    canvas.removeEventListener('mousedown', this.eventHandler)
    canvas.removeEventListener('mousemove', this.eventHandler)
    canvas.removeEventListener('mouseup', this.eventHandler)
    canvas.addEventListener('click',this.eventHandler)
    canvas.addEventListener('mousedown', this.eventHandler)
    canvas.addEventListener('mousemove', this.eventHandler)
    canvas.addEventListener('mouseup', this.eventHandler)
  }
  // addEvent(shape:any, fns:any,item:PDF_Element) {
  //   this.stack.push({
  //     shape: shape,
  //     handler: fns,
  //     item,
  //   })
  // }
  // emit(e:any) {
  //   this.stack.forEach((item) => {
  //     this.callBack(e.type,e,item.item,item.shape)
  //     if (item.handler[e.type] && item.shape.isPointRect(e)) {
  //       item.handler[e.type](e, item.item)
  //     }
  //   })
  // }
}