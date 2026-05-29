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
  <div class="control-buttons">
    <div>
      <button id="decreaseSPS">-</button>
      <span id="spsText">Number of shapes/s: 0</span>
      <button id="increaseSPS">+</button>
    </div>
    <div>
      <button id="decreaseGravity">-</button>
      <span id="gravityText">Gravity: 0</span>
      <button id="increaseGravity">+</button>
    </div>
  </div>
</div>
`

await PixiEngine.Startup();
PixiEngine.CurrentScene = new ShapeSpawnerScene();