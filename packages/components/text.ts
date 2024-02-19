import { Rect, ShapeType } from './../types/index';
import { PDF_Element_Props, PDF_Element_Style } from "../types";
import BaseCommon from "./common";
import { transformRotate } from '../utils/isPointPath';


export default class Text extends BaseCommon {
  text: string;
  fontSize: number;
  font: string;
  textBaseline: CanvasTextBaseline;
  shapeType: ShapeType;
  constructor(style: PDF_Element_Style, props: PDF_Element_Props) {
    super(style, props)
    this.text = props.label || ''
    this.fontSize = this.style.fontSize
    this.font = `${this.fontSize}px Helvetica Neue,Helvetica,Arial,PingFangSC-Regular,Microsoft YaHei,SimSun,sans-serif`
    this.textBaseline = 'top'
    this.shapeType = ShapeType.Rect
  }

  draw(_ctx: CanvasRenderingContext2D) {
    const rectPoint: Rect = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      radius: 0,
      color: '',
      angle:this.angle??0
    }
   
  
    this.drawAux(_ctx, rectPoint, this.active)
    this.width = Math.abs(this.width)
    this.height = Math.abs(this.height)
    // console.log("topRect",topRect)
    const {cx,cy}=this.getCenterPoint()
    this.x = this.x
    this.y =this.y
    _ctx.font = this.font
    _ctx.textBaseline = this.textBaseline
    let drawY = this.y
    let drawX = this.x
    _ctx.fillStyle = this.fillStyle
    _ctx.fillText(
      this.text,
      drawX,
      drawY
    )
    _ctx.fillStyle = "#0e65c5"
    _ctx.fillRect(drawX, drawY, this.width, this.height)
    _ctx.restore();
    _ctx.closePath();
   
  }
}