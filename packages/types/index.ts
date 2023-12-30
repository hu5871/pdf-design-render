
export enum RenderType {
  Text = "text",
  Circle = 'circle'
}

export type Params = {
  options: Options[]
}
export type Options = {
  pageWidth: number;
  pageHeight: number;
  element: PDF_Element[]
}
export interface PDF_Element {
  type: RenderType;
  style?: PDF_Element_Style;
  props?: PDF_Element_Props;
  on?: {
    [eventName: string]: (...arg) => void;
  }
}
export interface PDF_Render_Element extends PDF_Element {
  _id: number
  _active: boolean
}
export interface PDF_Element_Style {
  width?: number;
  height?: number;
  left?: number
  top?: number
  right?: number
  bottom?: number
  fill?: string
  radius?: number
  fontSize?: number
}

export interface PDF_Element_Props {
  label?: string// 文本
}


export interface PDF_Config {
  ratio: number
}

export enum ShapeType {
  Rect = 'rect',
  Circle = 'circle',
  Polygon = 'polygon'
}

export interface Point  {
  x: number
  y: number
}
export interface PointRect extends Point {
  width:number;
  height:number
}