import './style.css'
import { PixiEngine } from './Core/PixiEngine'
import { ShapeSpawnerScene } from './ShapeSpawner/ShapeSpawnerScene'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="page">
  <div class="left-group">
    <span id="shapeCount">Number of current shapes: 0</span>
    <span id="totalSurfaceArea">Surface area occupied by shapes: 0</span>
    <span id="fps">FPS: 0</span>
  </div>
  <div>
    <canvas id="canvas"></canvas>
  </div>
</div>
`

await PixiEngine.Startup();
PixiEngine.CurrentScene = new ShapeSpawnerScene();