<template>
  <div class="v-pdf-template">
  </div>
  <text style="font-size: 12px;">文本</text>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import {VarPdf} from '../packages'

import { Options } from '../packages/types';
const op:Options[]= [
  {
    pageWidth: 210 * (72 / 25.4),
    pageHeight: 297 * (72 / 25.4),
    element:[
      {
        type:"text",
        style:{
          top:100,
          left:100,
          fontSize:16,
        },
        props:{
          label:"文本"
        }
      }
    ]
  }
]
const varPdf =new VarPdf(op)
const pdfPages = varPdf.createTemplates()


onMounted(()=>{
  for (let i = 0; i < pdfPages.length; i++) {
    const element = pdfPages[i];
    document.querySelector('.v-pdf-template')?.appendChild(element)
  }
  varPdf.render()
})

</script>
<style scoped>

</style>
