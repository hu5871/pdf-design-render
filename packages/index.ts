
import { Canvas } from './canvas';
import BaseCommon from './components/common';
import { Render } from './render';
import {Options, PDF_Config} from './types'
export class VarPdf {
  options: Options[];
  canvas: Canvas[];
  config:PDF_Config
  constructor(options){
    this.options = options
    this.canvas=[]
  }
  createTemplates():(HTMLCanvasElement)[]{
    const {options}=this
    const canvasPages:(HTMLCanvasElement)[]=[]
    for (let i = 0; i < options.length; i++) {
      const {pageWidth:width,pageHeight:height,element} = options[i];
      const canvas=new Canvas({width,height,element})
      canvasPages.push(canvas.getCanvas() as HTMLCanvasElement )
      this.canvas.push(canvas)
    }
    return canvasPages.filter(Boolean)
  }
  render(){
    for (let index = 0; index < this.canvas.length; index++) {
      const cv = this.canvas[index];
      new Render(cv,cv.width,cv.height,cv.ratio).createElements()
    }
  }
}