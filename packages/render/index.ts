import { Canvas } from "../canvas";
import { PDF_Element } from "../types";
import Component from "../components/indext";

const  setList= new WeakSet()
export class Render extends Canvas {
  ins: Canvas;
  elements:PDF_Element[];
  ctx : CanvasRenderingContext2D
  constructor(canvasIns:Canvas,width:number,height:number,ratio:number){
    super({width,height,element:canvasIns.element})
    this.elements=canvasIns.element;
    this.ctx=canvasIns!._ctx;
    this.ctx.clearRect(0,0,width,height)
  }
  createElements(){
    const elements = [...this.elements]
    while(elements.length){
      const item =elements.shift()
      item && this.renderItem(item)
    }
  }
  renderItem(item:PDF_Element){
    const map =new WeakMap()
    map.set(item,item)
    if(setList.has(map)){
      return 
    }
    new Component[item.type](item.style,item.props).draw(this.ctx)
    setList.add(map)
  }
}