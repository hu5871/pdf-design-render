import { AnglePosition, Position } from './../types/index';
import { PDF_Element_Style, PDF_Element_Props, Point, Rect } from "../types"
import { calcVectorRadian, normalizeRadian } from '../utils/calc';
import ControlManage from '../control/control';

let defaultStyle: Required<PDF_Element_Style> = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  angle: 0,
  fill: '#fff',
  fontSize: 14,
  radius: 0
}

export default class BaseCommon {
  style: Required<PDF_Element_Style>
  x: number
  y: number
  width: number
  height: number
  fillStyle: string //填充的颜色
  radius: number  //圆
  props: PDF_Element_Props
  ratio: number
  point: number[];//存放点辅助坐标
  active: boolean
  rectMap: Map<Rect, Position>
  rotationMap: Map<Rect, AnglePosition>
  startRotation: number;
  angle: number;
  controlManage:ControlManage
  constructor(style: PDF_Element_Style, props: PDF_Element_Props) {
    this.startRotation = 0
   
    this.init(style, props, false)
    const {width,height,x,y,angle}=this
    this.controlManage=new ControlManage({width,height,x,y,angle})
  }

  init(style: PDF_Element_Style, props: PDF_Element_Props, active: boolean) {
    this.style = Object.assign({}, defaultStyle, style)
    this.angle = this.style?.angle || 0
    this.props = Object.assign({}, props)
    this.x = this.style.left || 0
    this.y = this.style.top || 0
    this.width = this.style.width || 100
    this.height = this.style.height || 50
    this.fillStyle = this.style.fill
    this.radius = this.style.radius
    this.active = active
  
  
  }
  update(style: PDF_Element_Style, props: PDF_Element_Props, active?: boolean) {
    this.init(style, props, !!active)
  }
  Observer() {

  }

  getCorner(width:number, height:number, cornerX:number, cornerY:number, angle:number) {
    var x, y, distance, diffX, diffY;
    // console.log(width,height,cornerX,cornerY,angle)
    // 获取中心到点的距离
    diffX = cornerX - width;
    diffY = cornerY - height;
    distance = Math.sqrt(diffX * diffX + diffY * diffY);
    // 查找从枢轴到角点的角度
    angle += Math.atan2(diffY, diffX);
    // 获取新的x和y并将其四舍五入为整数
    x = width + distance * Math.cos(angle);
    y = height + distance * Math.sin(angle);
    return {x:(x+0.5)|0, y:(y+0.5)|0};
  }


  // 获取中心点坐标
  getCenterPoint(): { cx: number, cy: number } {
    const { x, y, width, height } = this
    const cx = x + width / 2
    const cy = y + height / 2
    return {
      cx,
      cy
    }
  }


  drawAux(ctx: CanvasRenderingContext2D, rect: Rect, active: boolean) {
    ctx.save()
    const {width,height,x,y,angle} =rect
    active ? this.controlManage.draw({width,height,x,y,angle},ctx) : ''
    // 旋转包围盒
    if (this.angle) {
      const { cx, cy } = this.getCenterPoint()
      ctx.translate(cx, cy);
      ctx.rotate(this.angle);
      ctx.translate(-cx, -cy);
    }
  
    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.strokeStyle = !active ? 'rgba(0, 0, 0, 0)' : '#6299b7'
    ctx.strokeRect(x, y, width, height)
    ctx.closePath()
  }

  destroy(ctx: CanvasRenderingContext2D) {
  }


  /** 
   * @param ctx:canvas上下文
   * @param scrollTop: 距离
  */
  arcRadius(ctx: CanvasRenderingContext2D, scrollTop: number) {
    //计算出圆角的半径，取宽度和高度的一半中较小的值，确保圆角不会超出矩形的边界。
    let min = Math.min(this.width / 2, this.height / 2)
    // 定义矩形的起始点坐标（x，y）、宽度（w）和高度（h）。
    let x = this.x
    let y = this.y - scrollTop
    let w = this.width
    let h = this.height
    // 取圆角半径，如果指定的圆角半径大于计算得到的半径（min），则使用计算得到的半径。
    let r = this.radius > min ? min : this.radius

    //创建绘制路径
    ctx.beginPath()
    //绘制点 移动对应的x,y
    ctx.moveTo(x + r, y)
    // 圆弧对应的圆心横坐标、圆弧对应的圆心纵坐标、圆弧的半径大小、圆弧开始的角度，单位是弧度、圆弧结束的角度，单位是弧度。

    // 绘制第一个圆角，以右上角为起点，圆心为矩形右上角，弧度从水平方向开始，到垂直方向结束
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath() // 闭合路径
    ctx.clip()
  }
}