import { Options, PDF_Element } from "../types"

export class Canvas {
  width: number
  height: number
  _canvas: HTMLCanvasElement|null
  scale: number
  _ctx: CanvasRenderingContext2D
  element: PDF_Element[]
  ratio: number
  constructor({
    width, height, element
  }:{
    width: number
    height: number
    element:PDF_Element[]
  }) {
    this.width = width
    this.height = height
    this.element=element
    this._canvas = null

    if (!this._canvas) {
      this._canvas = document.createElement('canvas')
    }
    this.scale = window.devicePixelRatio

    this._canvas.width = this.width * this.scale
    this._canvas.height = this.height * this.scale

    this._canvas.style.width = this.width + 'px'
    this._canvas.style.height = this.height + 'px'
    this.ratio= window.innerWidth / (37.5 * 10)
    this._canvas!.getContext('2d')!.scale(this.scale, this.scale)
    this._ctx = this._canvas!.getContext('2d') as CanvasRenderingContext2D
  }

  getCanvas(){
    return this._canvas
  }
}