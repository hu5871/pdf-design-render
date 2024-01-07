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
      const {x,y,width,height,radius}=ins
     
      return (
        Math.sqrt(
          Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2),
        ) <= radius
      );
    }
    default:
      return false;
  }
};