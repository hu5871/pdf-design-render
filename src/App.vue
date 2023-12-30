<template>
  <button @click="handleUpdate">update</button>
  <div class="v-pdf-template">
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { VarPdf } from '../packages'
import { Options, RenderType } from '../packages/types';
import Stats from './stats'

var stats: any = new Stats();


const loop = function(){
  stats.update();
  window.requestAnimationFrame(function(){
  loop();
  })
}
onMounted(() => {
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  loop()
  
})

const op: Options[] = [
  {
    pageWidth: 210 * (72 / 25.4),
    pageHeight: 297 * (72 / 25.4),
    element: [
      {
        type:RenderType.Text,
        style: {
          top: 100,
          left: 100,
          fontSize: 16,
          width:200,
          height:200,
          fill: 'red',
        },
        props: {
          label: "文本",
        },
        on: {
          click(e: any, item: any) {
            // console.log(e, item)
          }
        }
      },
      {
        type:RenderType.Text,
        style: {
          top: 300,
          left: 100,
          fontSize: 16,
          fill: 'red',
        },
        props: {
          label: "一颗红心两只手，世世代代跟党走。 --平凡的世界",
        },
        on: {
          click(e: any, item: any) {
            // console.log(e, item)
          }
        }
      },
      {
        type:RenderType.Circle,
        style: {
          top: 600,
          left: 100,
          radius:50,
          fill: 'red',
        },
        props: {
        },
        on: {
          click(e: any, item: any) {
            // console.log(e, item)
          }
        }
      }
    ]
  }
]
const varPdf = new VarPdf(op)
const pdfPages = varPdf.createTemplates()


onMounted(() => {
  for (let i = 0; i < pdfPages.length; i++) {
    const element = pdfPages[i];
    document.querySelector('.v-pdf-template')?.appendChild(element)
  }
  varPdf.render()
})


function handleUpdate(){
  
}
</script>
<style scoped></style>
