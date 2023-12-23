
export  type Params = {
  options:Options[]
}
export  type Options = {
  pageWidth:number;
  pageHeight:number;
  element: PDF_Element[]
}
export  interface PDF_Element {
  type: string;
  style?:PDF_Element_Style;
  props?: PDF_Element_Props
}

export interface PDF_Element_Style {
  width?: number;
  height?:number;
  left?: number
  top?: number
  right?: number
  bottom?: number
  fill?: string
  radius?: number
  fontSize?:number
}

export interface PDF_Element_Props{
  label:string// 文本
}


export interface PDF_Config{
  ratio: number
}
