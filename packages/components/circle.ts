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
      x:this.x - this.height/2,
      y:this.y- this.height/2,
      width:this.width,
      height:this.height,
      radius:this.width/2,
      color:""
    }
    this.drawAux(_ctx,rectPoint,this.active)
    this.width=Math.abs(this.width)
    this.height=Math.abs( this.height)
    const minVal=Math.min(this.width,this.height)
    const maxVal=Math.max(this.width,this.height)

    // a和b分别表示椭圆的长轴和短轴长度
    // this.radius=(maxVal - minVal) / maxVal
    const topRect=this.rects[0][0]
    this.x= topRect.x+this.width/2
    this.y=topRect.y+this.height/2
    _ctx.beginPath();
    // _ctx.arc(this.x, this.y, this.style?.width / 2, 0, Math.PI * 2);
    _ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    _ctx.fillStyle=this.fillStyle
    _ctx.fill();
    _ctx.closePath();
    return {
      x:this.x,
      y:this.y,
      width:this.width,
      height:this.height
     }
  }
}