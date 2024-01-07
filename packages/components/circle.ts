import { PointRect, ShapeType } from './../types/index';
import { PDF_Element_Props, PDF_Element_Style } from "../types";
import BaseCommon from "./common";


export default class Circle extends BaseCommon {
  shapeType: ShapeType;
  constructor(style:PDF_Element_Style,props:PDF_Element_Props){
    super(style,props)
    this.shapeType=ShapeType.Circle
   
  }

  draw(_ctx:CanvasRenderingContext2D) {
    const rectPoint:PointRect={
      x:this.x,
      y:this.y,
      width:this.width,
      height:this.height,
      radius:0,
      color:""
    }
    this.drawAux(_ctx,rectPoint,this.active)
    this.width=Math.abs(this.width)
    this.height=Math.abs( this.height)
    const topRect=this.rects[0][0]
    this.x= topRect.x+this.width/2
    this.y=topRect.y+this.height/2
    _ctx.beginPath();
    _ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    _ctx.fillStyle=this.fillStyle
    _ctx.fill();
    _ctx.closePath();
  }
}