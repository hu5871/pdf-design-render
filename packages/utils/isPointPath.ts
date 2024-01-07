import { Point, ShapeType } from "../types";

export default function isPointPath  (
  ins:any,
  point: Point,
  shape: ShapeType,
): boolean  {
  if (!point) return false;
  switch (shape) {
    case ShapeType.Rect: {
      return (
        ins.x <= point.x &&
        ins.x + ins.width >= point.x &&
        ins.y <= point.y &&
        ins.y + ins.height >= point.y
      );
    }
    case ShapeType.Circle: {
      const {x:cx,y:cy,width,height,radius}=ins
      const {x,y}=point
      const w = width / 2 
      const h = height / 2 
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