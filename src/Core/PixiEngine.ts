import { Application, Point, Rectangle, Ticker } from 'pixi.js'
import { Scene } from '../Scene/Scene'

export class PixiEngine
{
    private static PixiApp: Application;
    private static _currentScene: Scene;

    public static set CurrentScene(scene: Scene)
    {
        PixiEngine._currentScene = scene;
        PixiEngine.PixiApp.stage.addChild(PixiEngine._currentScene.CurrentContainer);
    }
    
    public static get CurrentScene(): Scene
    {
        return PixiEngine._currentScene;
    }

    public static async Startup(scene: Scene): Promise<void>
    {
        PixiEngine.PixiApp = new Application();
        // @ts-ignore - For PixiJS debugging
        globalThis.__PIXI_APP__ = PixiEngine.PixiApp;

        await PixiEngine.PixiApp.init({
            canvas: document.getElementById('canvas') as HTMLCanvasElement,
            resizeTo: window,
            backgroundAlpha: 0
        })

        PixiEngine.PixiApp.ticker = new Ticker();
        PixiEngine.PixiApp.ticker.add(PixiEngine.UpdateLoop);
        PixiEngine.CurrentScene = scene;
        PixiEngine.PixiApp.ticker.start();
    }
    
    public static UpdateLoop(ticker: Ticker): void
    {
        PixiEngine.CurrentScene?.Update(ticker.deltaMS / 1000);
        PixiEngine.CurrentScene?.Render();
    }

    public static GetCurrentScene(): Scene | null
    {
        return PixiEngine.CurrentScene;
    }

    public static GetCanvasBounds(): Rectangle
    {
        return PixiEngine.PixiApp.screen.getBounds();
    }
}