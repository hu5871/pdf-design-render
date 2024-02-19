import { Point, Rect } from "../types";


const DOUBLE_PI = Math.PI * 2;

/**
 * 求向量到上边(y负半轴)的夹角
 * 范围在 [0, Math.PI * 2)
 */
export function calcVectorRadian(x: number, y: number, rx: number, ry: number) {
  const a = [x - rx, y - ry];
  const b = [0, -1];
  const dotProduct = a[0] * b[0] + a[1] * b[1];
  const d =
    Math.sqrt(a[0] * a[0] + a[1] * a[1]) * Math.sqrt(b[0] * b[0] + b[1] * b[1]);
  let radian = Math.acos(dotProduct / d);
  if (x < rx) {
    radian = DOUBLE_PI - radian;
  }
  return radian;
}

/**
 * normalize radian, make it in [0, Math.PI * 2)
 */
export const normalizeRadian = (radian: number): number => {
  radian = radian % DOUBLE_PI;
  if (radian < 0) {
    radian += DOUBLE_PI;
  }
  return radian;
};

/**
 * 规范化矩形对象，确保 width 和 height 为非负值。
 * @param rect - 输入矩形对象
 * @returns 规范化后的矩形对象
 */
export const normalizeRect = ({ x, y, width, height }: Rect): Rect => {
  // 计算矩形右下角坐标
  const x2 = x + width;
  const y2 = y + height;
  return getRectByTwoPoint({ x, y }, { x: x2, y: y2 });
};


/**
 * 根据两个点的坐标创建矩形对象。
 * @param point1 - 第一个点的坐标
 * @param point2 - 第二个点的坐标
 * @returns 创建的矩形对象
 */
export const getRectByTwoPoint = (point1: Point, point2: Point): Rect => {
  // 计算矩形左上角坐标、宽度和高度
  return {
    x: Math.min(point1.x, point2.x),
    y: Math.min(point1.y, point2.y),
    width: Math.abs(point1.x - point2.x),
    height: Math.abs(point1.y - point2.y),
  };
};

/**
 * normalize degree, make it in [0, 360)
 */
export const normalizeDegree = (degree: number): number => {
  degree = degree % 360;
  if (degree < 0) {
    degree += 360;
  }
  return degree;
};
