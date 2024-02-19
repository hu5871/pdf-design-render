import { Point, ShapeType } from "../types";

export const transformRotate = (
  x: number,
  y: number,
  radian: number,
  cx: number,
  cy: number,
): Point => {
  if (!radian) {
    return { x, y };
  }
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  return {
    x: (x - cx) * cos - (y - cy) * sin + cx,
    y: (x - cx) * sin + (y - cy) * cos + cy,
  };
};

export default function isPointPath  (
  ins:any,
  point: Point,
  shape: ShapeType,
): boolean  {
  if (!point) return false;
  const angle=ins.angle
  let p = {...point}
  switch (shape) {
    case ShapeType.Rect: {
      if (angle) {
        const [cx, cy] = [ins.x + ins.width / 2, ins.y + ins.height / 2];
        p = transformRotate(point.x, point.y, -angle, cx, cy);
      }
      return (
        ins.x <= p.x &&
        ins.x + ins.width >= p.x &&
        ins.y <= p.y &&
        ins.y + ins.height >= p.y
      );
    }
    case ShapeType.Circle: {
      const {x:cx,y:cy,width,height,radius}=ins
      const w = width / 2 
      const h = height / 2 
      
      const {x,y} =angle
      ? transformRotate(p.x, p.y, -angle, cx, cy)
      : { x:p.x, y:p.y };
      return (
        (x - cx) ** 2 / w ** 2 +
        (y - cy) ** 2 / h ** 2 <=
        1
      );
    }
    default:
      return false;
  }
};