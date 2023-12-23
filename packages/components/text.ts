import { PDF_Element_Props, PDF_Element_Style } from "../types";
import BaseCommon from "./common";

export default class Text extends BaseCommon {
  text: string;
  fontSize: number;
  font: string;
  constructor(style:PDF_Element_Style,props:PDF_Element_Props){
    super(style,props)
    this.text = props.label
    this.fontSize = this.style.fontSize
    this.height = this.fontSize
    this.font = `${this.fontSize}px Helvetica Neue,Helvetica,Arial,PingFangSC-Regular,Microsoft YaHei,SimSun,sans-serif`
  }

  draw(ctx:CanvasRenderingContext2D, scrollTop:number=0) {
    const text=this.text
    this.width = this.width || ctx.measureText(text).width
    let drawY = this.startY - scrollTop
    let drawX = this.startX
    ctx.font = this.font
    ctx.fillText(
      text,
      drawX,
      drawY
    )
  }
}