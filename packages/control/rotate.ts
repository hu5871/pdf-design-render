import { Point } from "../types"
import { calcVectorRadian, normalizeRadian } from "../utils/calc"

export class Rotate {
  startRotation: number
  constructor() { }
  //开始旋转
  startRota({ x, y }: Point, { x: cx, y: cy }: Point) {
    this.startRotation = calcVectorRadian(cx, cy, x, y)
    console.log("startRotate", this.startRotation)
  }
  rotating({ x, y }: Point, { x: cx, y: cy }: Point,startAngle:number): number {
    // 旋转
    const dRotation = calcVectorRadian(cx, cy, x, y)
    const angle = (dRotation - this.startRotation)
    return normalizeRadian(startAngle + angle)
  }
  endRota() {
  }

}