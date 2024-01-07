import { PointRect, ShapeType } from './../types/index';
import { PDF_Element_Props, PDF_Element_Style } from "../types";
import BaseCommon from "./common";


export default class Text extends BaseCommon {
  text: string;
  fontSize: number;
  font: string;
  textBaseline: CanvasTextBaseline;
  shapeType: ShapeType;
  constructor(style:PDF_Element_Style,props:PDF_Element_Props){
    super(style,props)
    this.text = props.label||''
    this.fontSize = this.style.fontSize
    this.font = `${this.fontSize}px Helvetica Neue,Helvetica,Arial,PingFangSC-Regular,Microsoft YaHei,SimSun,sans-serif`
    this.textBaseline = 'top'
    this.shapeType=ShapeType.Rect
  }

  draw(_ctx:CanvasRenderingContext2D):PointRect {
    const rectPoint:PointRect={
      x:this.x,
      y:this.y,
      width:this.width,
      height:this.height,
      radius:0,
      color:''
    }
    this.drawAux(_ctx,rectPoint,this.active)
    this.width=Math.abs(this.width)
    this.height=Math.abs( this.height)
    const topRect=this.rects[0][0]
    this.x=topRect.x
    this.y=topRect.y
    
    _ctx.font = this.font
    _ctx.textBaseline = this.textBaseline
    const textMetrics =  _ctx.measureText(this.text)
    // this.width = this.width || textMetrics.width
    // this.height= this.height||textMetrics.actualBoundingBoxAscent+ textMetrics.actualBoundingBoxDescent
    let drawY = this.y 
    let drawX = this.x
    _ctx.fillStyle = this.fillStyle
    _ctx.fillText(
      this.text,
      drawX,
      drawY
    )
   return {
    x:this.x,
    y:this.y,
    width:this.width,
    height:this.height
   }
  }
}