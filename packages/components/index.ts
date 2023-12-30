import { RenderType } from '../types'
import Circle from './circle'
import Text from './text'


const ComponentMap={
  [RenderType.Text]:Text,
  [RenderType.Circle]:Circle,
}

export default ComponentMap
