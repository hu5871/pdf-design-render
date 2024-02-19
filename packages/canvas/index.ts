import { CursorType, Options, PDF_Element } from "../types"
import { normalizeDegree } from "../utils/calc"
import getCursorSvg from "../utils/getCursorSvg"
let canvas_id=0
export class Canvas  {
  width: number
  height: number
  _canvas: HTMLCanvasElement|null
  scale: number
  _ctx: CanvasRenderingContext2D
  element: PDF_Element[]
  ratio: number
  canvasIns: this
  constructor({
    width, height
  }:{
    width: number
    height: number
  }) {
    this.canvasIns=this
    this.width = width
    this.height = height
    this._canvas = null
   
    if (!this._canvas) {
      this._canvas = document.createElement('canvas')
    }
    this.scale = window.devicePixelRatio
    this._canvas.dataset.canvas_id=(canvas_id++)+''
    this._canvas.width = this.width * this.scale
    this._canvas.height = this.height * this.scale

    this._canvas.style.width = this.width + 'px'
    this._canvas.style.height = this.height + 'px'
    this._canvas.style.marginBottom = 30 + 'px'
    this._canvas.style.boxShadow=`0px 0px 20px -6px #000000`
    this.ratio= window.innerWidth / (37.5 * 10)
    this._canvas!.getContext('2d')!.scale(this.scale, this.scale)
    this._ctx = this._canvas!.getContext('2d') as CanvasRenderingContext2D
  }

  getCanvas(){
    return this._canvas
  }

  getCanvasCenter():{cx:number,cy:number}{
    const cx =  this._canvas!.width / 2
    const cy =  this._canvas!.height / 2
    return {
      cx,
      cy
    }
  }
  clear(canvas:Canvas){
    canvas._ctx.clearRect(0,0,this.width*this.scale,this.height*this.scale)
  }

  setCursorStyle(type:CursorType,degree:number){
    this._canvas!.style.cursor=getCursorSvg({
      type,
      degree
    })||''
  }


  selectControl(){}

  noop(){

  }
}