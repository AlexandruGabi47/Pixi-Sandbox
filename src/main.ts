import './style.css'
import { PixiEngine } from './Core/PixiEngine'
import { ShapeSpawnerScene } from './ShapeSpawner/ShapeSpawnerScene'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<p id="shapeCount">Number of current shapes: 0</p>
<p id="totalSurfaceArea">Surface area occupied by shapes: 0</p>
<section id="center">
  <canvas id="canvas"></canvas>
</section>
`

await PixiEngine.Startup(new ShapeSpawnerScene('ShapeSpawnerScene'))