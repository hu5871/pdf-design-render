import { Point, Rect } from "../types";
import { normalizeRect } from "../utils/calc";
import { transformRotate } from "../utils/isPointPath";


export type ResizeDirection = "nw" | "ne" | "n" | "w" | "sw" | "se" | "s" | "e" | "nwRotate" | "neRotate" | "swRotate" | "seRotate"
interface GetSizeOrigin {
  getSize: (
    rect: Rect,
    posX: number,
    posY: number,
  ) => {
    width: number;
    height: number;
  };
  getOrigin: (
    rect: Rect,
    newWidth: number,
    newHeight: number,
  ) => [number, number, number, number];
}


//西北句柄
const nw: GetSizeOrigin = {
  getSize: (
    rect: Rect,
    posX: number,
    posY: number,
  ) => {
    return { width: rect.x + rect.width - posX, height: rect.y + rect.height - posY };
  },
  getOrigin: (rect: Rect, newWidth, newHeight) => [
    rect.x + rect.width,
    rect.y + rect.height,
    rect.x + newWidth,
    rect.y + newHeight,
  ],
}
//东北句柄
const ne: GetSizeOrigin = {
  getSize: (
    rect: Rect,
    posX: number,
    posY: number,

  ) => {
    let width = 0;
    let height = 0;
    width = posX - rect.x;
    height = rect.y + rect.height - posY;
    return { width, height };
  },
  getOrigin: (rect: Rect, _newWidth, newHeight) => [
    rect.x,
    rect.y + rect.height,
    rect.x,
    rect.y + newHeight,
  ],
}
//正北
const n: GetSizeOrigin = {
  getSize: (
    rect: Rect,
    _: number,
    posY: number,
  ) => {
    let width = 0;
    let height = 0;
    width = rect.width;
    height = rect.y + rect.height - posY;
    return { width, height };
  },
  getOrigin: (rect: Rect, newWidth, newHeight) => [
    rect.x + rect.width / 2,
    rect.y + rect.height,
    rect.x + newWidth / 2,
    rect.y + newHeight,
  ],
}
//正西
const w: GetSizeOrigin = {
  getSize: (
    rect: Rect,
    posX: number,
    _: number,
  ) => {
    let width = 0;
    let height = 0;
    width = rect.x + rect.width - posX;
    height = rect.height;
    return { width, height };
  },
  getOrigin: (rect: Rect, newWidth: number, newHeight: number) => [
    rect.x + rect.width,
    rect.y + rect.height / 2,
    rect.x + newWidth,
    rect.y + newHeight / 2,
  ],
}
//西南
const sw: GetSizeOrigin = {
  getSize: (
    rect: Rect,
    posX: number,
    posY: number,
  ) => {
    let width = 0;
    let height = 0;
    width = rect.x + rect.width - posX;
    height = posY - rect.y;
    return { width, height };
  },
  getOrigin: (rect: Rect, newWidth) => [
    rect.x + rect.width,
    rect.y,
    rect.x + newWidth,
    rect.y,
  ],
}
//东南
const se: GetSizeOrigin = {
  getSize: (
    rect: Rect,
    posX: number,
    posY: number,
  ) => {
    let width = 0;
    let height = 0;
    width = posX - rect.x;
    height = posY - rect.y;
    return { width, height };
  },
  getOrigin: (rect: Rect) => [rect.x, rect.y, rect.x, rect.y],
}
//正南
const s: GetSizeOrigin = {
  getSize: (
    rect: Rect,
    _: number,
    posY: number,
  ) => {
    let width = 0;
    let height = 0;
    width = rect.width;
    height = posY - rect.y;
    return { width, height };
  },
  getOrigin: (rect: Rect, newWidth: number) => [
    rect.x + rect.width / 2,
    rect.y,
    rect.x + newWidth / 2,
    rect.y,
  ],
}
//正东
const e: GetSizeOrigin = {
  getSize: (
    rect: Rect,
    posX: number,
    _: number,
  ) => {
    let width = 0;
    let height = 0;

    width = posX - rect.x;
    height = rect.height;
    return { width, height };
  },
  getOrigin: (rect: Rect, _newWidth, newHeight) => [
    rect.x,
    rect.y + rect.height / 2,
    rect.x,
    rect.y + newHeight / 2,
  ],
}


const queryFunction = {
  nw, ne, n, w, sw, se, s, e
}
export default class Resize {
  constructor() {

  }
  calc(startRect: Rect, point: Point, dir: ResizeDirection): Rect {
    const query = queryFunction[dir]
    const { x: startX, y: startY, width: startWidth, height: startHeight, angle: startAngle } = startRect
    // 计算中心点
    const cx = startX + startWidth / 2;
    const cy = startY + startHeight / 2;
    // 计算旋转后的x,y
    const { x: posX, y: posY } = transformRotate(
      point.x,
      point.y,
      -(startAngle || 0),
      cx,
      cy,
    );
    // 更新宽高
    let { width, height } = query.getSize(
      startRect,
      posX,
      posY,
    );

    //记录上一个原点和当前原点的坐标
    let prevOriginX = 0;
    let prevOriginY = 0;
    let originX = 0;
    let originY = 0;

    [prevOriginX, prevOriginY, originX, originY] = query.getOrigin(
      startRect,
      width,
      height,
    );

    // 旋转前后的原点坐标
    const { x: prevRotatedOriginX, y: prevRotatedOriginY } = transformRotate(
      prevOriginX,
      prevOriginY,
      startAngle || 0,
      cx,
      cy,
    );
    const { x: rotatedOriginX, y: rotatedOriginY } = transformRotate(
      originX,
      originY,
      startAngle || 0,
      startX + width / 2,
      startY + height / 2,
    );
    //计算偏移量
    const dx = rotatedOriginX - prevRotatedOriginX;
    const dy = rotatedOriginY - prevRotatedOriginY;
    const x = startX - dx;
    const y = startY - dy;

    // 创建返回的矩形对象，并进行规范化处理
    const retRect: Rect = normalizeRect({
      x,
      y,
      width,
      height,
    });
    if (startAngle !== undefined) {
      retRect.angle = startAngle;
    }
    return retRect
  }
  rotate() { }


}
