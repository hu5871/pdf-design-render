
import { Canvas } from './canvas';
import { Render } from './render';
import {Options, PDF_Config} from './types'
export class VarPdf {
  options: Options[];
  canvas: Canvas[];
  config:PDF_Config
  renders:Render[]
  mode: 'temp'|'prod';
  constructor(options){
    this.options = options
    this.canvas=[]
    this.renders=[]
    
  }
  createTemplates():(HTMLCanvasElement)[]{
    this.mode='temp'
    const {options}=this
    const canvasPages:(HTMLCanvasElement)[]=[]
    for (let i = 0; i < options.length; i++) {
      const {pageWidth:width,pageHeight:height,element} = options[i];
      const render= new Render(width,height,element) 
      this.renders.push(render)
      canvasPages.push(render.getCanvas() as HTMLCanvasElement )
    }
    return canvasPages.filter(Boolean)
  }
  render(){
    for (let index = 0; index < this.renders.length; index++) {
      const cv = this.renders[index];
      cv.createElements()
    }
    return this.renders
  }
  clear(){
    this.canvas=[]
    this.renders=[]
  }
}