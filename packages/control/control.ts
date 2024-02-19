import { Point, Position, Rect, ShapeType } from "../types";
import isPointPath, { transformRotate } from "../utils/isPointPath";
import Resize from "./resize";
import { Rotate } from "./rotate";

class ControlManage {
  sizePoints: Map<Rect, string>;
  rotatePoints: Map<Rect, string>
  resize: Resize;
  rotate: Rotate;
  constructor(rect:Rect) {
    this.sizePoints = this.createdControlSizePoint(rect);
    this.rotatePoints = this.createdControlRotatePoint(rect);
    this.resize=new Resize()
    this.rotate=new Rotate()
  }
  getDir(dir:string):Rect|null{
    let rect:Rect|null=null
    for (const [value,d] of this.sizePoints) {
      if(d == dir){
        rect=value
        break
      }
    }
    if(!rect) {
      throw new Error("handle direction is not exist");
    }
    return rect
  }
  // 创建 矩形大小的控制点 坐标
  createdControlSizePoint(rect: Rect): Map<Rect, string> {
    const { x, y, width, height, angle = 0 } = rect;
    const [cx, cy] = [rect.x + rect.width / 2, rect.y + rect.height / 2];
    const sizePoints = new Map<Rect, string>()
    const size=14;
    const color="#4092f6"
    let points: Rect[] = [
      { width: size, height: size, x, y, type:"nw",color },//西北
      { width: size, height: size, x: x + width / 2, y, type: 'n',color },//正北
      { width: size, height: size, x: x + width, y, type: 'ne',color },//东北
      { width: size, height: size, x: x, y: y + height / 2, type: 'w',color  },//西
      { width: size, height: size, x: x + width, y: y + height / 2, type: 'e',color  },//东
      { width: size, height: size, x: x + width, y: y + height, type: "se",color  },//东南
      { width: size, height: size, x: x + width / 2, y: y + height, type: "s",color },//南
      { width: size, height: size, x, y: y + height, type: "sw",color },//西南
    ];


    console.log(angle)
    if (angle) {
      points = points.map((point) => ({
        ...point,
        ...transformRotate(point.x, point.y, angle, cx, cy)
      }));
      console.log(angle,points)
    }

    points.map(item => {
      sizePoints.set(item, item.type!)
    })
    return sizePoints
  }

  createdControlRotatePoint(rect: Rect): Map<Rect, string> {
    

    const { x, y, width, height, angle = 0 } = rect

    const [cx, cy] = [x + width / 2, y + height / 2];
    const rotatePoints = new Map<Rect, string>()

    let points:Rect[] = [
      { width: 20, height: 20, x:x-20, y:y-20, type: "nw" },
      { width: 20, height: 20, x: x + width+20, y:y-20, type: "ne" },
      { width: 20, height: 20, x: x + width+20, y: y + height+20, type: "se" },
      { width: 20, height: 20, x:x-20, y: y + height+20, type: "sw" },
    ];

    if (angle) {
      points = points.map((point) => ({
        ...point,
        ...transformRotate(point.x, point.y, angle, cx, cy)
      }));
    }


    points.map(item => {
      rotatePoints.set(item, item.type!)
    })
    return rotatePoints
  }
  draw(rect: Rect, ctx: CanvasRenderingContext2D) {
    const sizePoints = this.sizePoints = this.createdControlSizePoint(rect);
    const rotatePoints = this.rotatePoints = this.createdControlRotatePoint(rect);
    // console.log("draw")
    for (const [rect] of sizePoints) {
      const { x, y, color,width } = rect
      if (x < 0 || y < 0) continue
      ctx.beginPath();
      ctx.arc(x, y, width/2, 0, Math.PI * 2);
      ctx.fillStyle = color || '#000000'
      ctx.fill();
      ctx.closePath()
    }
    for (const [rect] of rotatePoints) {
      const { x, y, color, width } = rect
      if (x < 0 || y < 0) continue
      ctx.beginPath();
      ctx.arc(x, y, width / 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0)'
      ctx.stroke();
      ctx.closePath()
    }
    return
  }
  isHit(point:Point,type:"size"|"rotate"):Rect|null{
    const { sizePoints,rotatePoints} =this
    const map ={ size:sizePoints,rotate:rotatePoints }
    return this.forIsHit(map[type],point)
  }

  forIsHit(mapPoints: Map<Rect, string>,{x,y}:Point):Rect|null{
    let r:Rect|null=null
    for (const [rect,_] of mapPoints) {
     
      console.log(rect)
      const isHit=isPointPath(rect, { x, y }, ShapeType.Circle)
      console.log(rect,{x,y},isHit)
      if(isHit){
        r=rect
        break
      }
    }
    return r
  }
  
}


export default ControlManage