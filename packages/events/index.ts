import { PDF_Element, RenderType } from "../types"

export default class Events {
  ctx: CanvasRenderingContext2D
  callBack: (e: Events| MouseEvent) => void
  constructor(ctx: CanvasRenderingContext2D,callBack:(e:Events| MouseEvent)=>void) {
    console.log("Events")
    this.ctx = ctx
    this.callBack =callBack
  }
  init(canvas:HTMLCanvasElement) {
    canvas.removeEventListener('click', this.callBack)
    canvas.removeEventListener('mousedown', this.callBack)
    canvas.removeEventListener('mousemove', this.callBack)
    canvas.removeEventListener('mouseup', this.callBack)
    canvas.addEventListener('click',this.callBack)
    canvas.addEventListener('mousedown', this.callBack)
    canvas.addEventListener('mousemove', this.callBack)
    canvas.addEventListener('mouseup', this.callBack)
  }
}