import { Application, Container, Rectangle, Ticker } from 'pixi.js'
import { Scene } from '../Scene/Scene'

export class PixiEngine
{
    private static PixiApp: Application;
    private static _currentScene: Scene;

    public static set CurrentScene(scene: Scene)
    {
        PixiEngine._currentScene = scene;
        PixiEngine.AddContainer(scene.CurrentContainer);
    }

    public static get CurrentScene(): Scene
    {
        return PixiEngine._currentScene;
    }

    public static AddContainer(container: Container): void
    {
        PixiEngine.PixiApp.stage.addChild(container);
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
        PixiEngine.CurrentScene.Init();

        PixiEngine.PixiApp.ticker.start();
    }

    private static UpdateLoop(ticker: Ticker): void
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

    public static GetFPS(): number
    {
        return PixiEngine.PixiApp.ticker.FPS;
    }
}