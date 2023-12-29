import { PDF_Element_Props, PDF_Element_Style } from "../types";
import BaseCommon from "./common";

export default class Text extends BaseCommon {
  text: string;
  fontSize: number;
  font: string;
  textBaseline: CanvasTextBaseline;
  constructor(style:PDF_Element_Style,props:PDF_Element_Props){
    super(style,props)
    this.text = props.label||''
    this.fontSize = this.style.fontSize
    this.font = `${this.fontSize}px Helvetica Neue,Helvetica,Arial,PingFangSC-Regular,Microsoft YaHei,SimSun,sans-serif`
    this.textBaseline = 'top'
  }

  draw(_ctx:CanvasRenderingContext2D) {
    _ctx.font = this.font
    _ctx.textBaseline = this.textBaseline
    const textMetrics =  _ctx.measureText(this.text)
    this.width = this.width || textMetrics.width
    this.height=this.height||textMetrics.actualBoundingBoxAscent+ textMetrics.actualBoundingBoxDescent
   
    let drawY = this.startY 
    let drawX = this.startX
    _ctx.fillStyle = this.fillStyle
    _ctx.fillText(
      this.text,
      drawX,
      drawY
    )
    this.active && this.drawAux(_ctx)
  }
}