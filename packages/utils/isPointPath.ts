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
        ins.startX <= point.x &&
        ins.startX + ins.width >= point.x &&
        ins.startY <= point.y &&
        ins.startY + ins.height >= point.y
      );
    }
    case ShapeType.Circle: {
      return (
        Math.sqrt(
          Math.pow(point.x - ins.startX, 2) + Math.pow(point.y - ins.startY, 2),
        ) <= ins.radius
      );
    }
    default:
      return false;
  }
};