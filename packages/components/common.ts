import { PDF_Element_Style, PDF_Element_Props, Point, PointRect } from "../types"

let defaultStyle: Required<PDF_Element_Style> = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  fill: '#fff',
  fontSize: 14,
  radius: 0
}

export default class BaseCommon {
  style: Required<PDF_Element_Style>
  startX: number
  startY: number
  width: number
  height: number
  fillStyle: string //填充的颜色
  radius: number  //圆
  props: PDF_Element_Props
  ratio: number
  point: number[];//存放点辅助坐标
  active: boolean
  rects: {x:number,y:number}[][]
  constructor(style: PDF_Element_Style, props: PDF_Element_Props) {
    this.init(style, props, false)

  }

  init(style: PDF_Element_Style, props: PDF_Element_Props, active: boolean) {
    this.style = Object.assign({}, defaultStyle, style)
    this.props = Object.assign({}, props)
    this.startX = this.style.left || 0
    this.startY = this.style.top || 0
    this.width = this.style.width || 0
    this.height = this.style.height || 0
    this.fillStyle = this.style.fill
    this.radius = this.style.radius
    this.active = active
    this.rects=[]
  }

  update(style: PDF_Element_Style, props: PDF_Element_Props, active?: boolean) {
    this.init(style, props, !!active)
  }

  drawAux(ctx: CanvasRenderingContext2D,rect:PointRect, active: boolean) {
    const {x,y, width = 0, height = 0 } =rect
    ctx.lineWidth = 1;
    ctx.strokeStyle = !active ? 'rgba(0, 0, 0, 0)' : '#6299b7'
    ctx.strokeRect(x, y, width, height)
    //绘画可拖动缩放圆
    if (active) {
      // 存放各个方向圆点坐标
      this.rects = this.getPoint(x, y, width, height)
      // 绘制圆形
      for (let i = 0; i <  this.rects.length; i++) {
        const points =  this.rects[i];
        points.forEach(({x,y}) => {
          if(x<0 || y<0) return
          ctx.save();
          ctx.beginPath();
          ctx.arc(x,y, 5, 0, Math.PI * 2);
          ctx.fillStyle="#6299b7"
          ctx.fill();
          ctx.stroke();
        });
      }
    }
  }

  getPoint(x:number, y:number, width:number, height:number):{x:number,y:number}[][] {
    // 顶部三个点的坐标
    const top = [
      {
        x: x,
        y: y 
      },
      {
        x: (x + width / 2),
        y: y 
      },
      {
        x: x + width,
        y: y 
      },
    ]
     // 顶部三个点的坐标
     const center = [
      {
        x: x ,
        y: y + (height / 2)
      },
      {
        x: -1,
        y: -1
      },
      {
        x: x + width,
        y: y  + (height / 2)
      },
    ]
     // 顶部三个点的坐标
     const bottom = [
      {
        x: x,
        y: y + height
      },
      {
        x: (x + width / 2),
        y: y + height
      },
      {
        x: x + width,
        y: y + height
      },
    ]
    return [
      top,
      center,
      bottom,
    ]
  }


  destroy(ctx: CanvasRenderingContext2D) {
  }

  // isPointRect({ offsetX, offsetY }) {
  //   let x = offsetX
  //   let y = offsetY
  //   if (
  //     x >= this.startX &&
  //     x <= this.width + this.startX &&
  //     y >= this.startY &&
  //     y <= this.height + this.startY) {
  //     return true
  //   }
  //   return false
  // }
 

  /** 
   * @param ctx:canvas上下文
   * @param scrollTop: 距离
  */
  arcRadius(ctx: CanvasRenderingContext2D, scrollTop: number) {
    //计算出圆角的半径，取宽度和高度的一半中较小的值，确保圆角不会超出矩形的边界。
    let min = Math.min(this.width / 2, this.height / 2)
    // 定义矩形的起始点坐标（x，y）、宽度（w）和高度（h）。
    let x = this.startX
    let y = this.startY - scrollTop
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