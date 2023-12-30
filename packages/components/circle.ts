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
    this.width=this.style?.radius*2
    this.height=this.style?.radius*2
    _ctx.beginPath();
    _ctx.arc(this.startX, this.startY, this.radius, 0, Math.PI * 2);
    _ctx.fillStyle="#6299b7"
    _ctx.fill();
    _ctx.stroke();
    const rectPoint:PointRect={
      x:this.startX - this.height/2,
      y:this.startY- this.height/2,
      width:this.width,
      height:this.height
    }
    this.drawAux(_ctx,rectPoint,this.active)
  }
}