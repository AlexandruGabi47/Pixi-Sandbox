import { GameObject } from "../ECS/GameObject";
import { Scene } from "../Scene/Scene";
import { Utils } from "../Core/Utils";
import { PixiEngine } from "../Core/PixiEngine";
import { Graphics, GraphicsContext, Point, Rectangle } from "pixi.js"
import { ShapeGameObjectPool } from "./ShapeGameObjectPool";
import { ShapeType } from "../Shapes/ShapeGraphicsContext";

export enum Colors
{
    Red = "#7e1010",
    Orange = "#db9b10",
    Yellow = "#d4d419",
    Green = "#32a732",
    Cyan = "#1ccccc",
    Blue = "#2d62c4",
    Magenta = "#821eb1",
    Pink = "#cc14bd"
}

export class ShapeSpawnerScene extends Scene
{
    private _shapesPerSecond: number = 1;
    private _gravity: number = 200;

    private readonly shapePool: ShapeGameObjectPool;
    private readonly individualShapePoolSize: number = 10;

    private timeSinceLastSpawn: number = 0;

    private maskArea: Graphics;
    private mask: Graphics;
    private readonly maskHeightReduction: number = 100;

    private readonly shapeCountElementID: string = "shapeCount";
    private readonly totalSurfaceAreaElementID: string = "totalSurfaceArea";
    private readonly fpsElementID: string = "fps";

    private shapeCountElement: HTMLElement | null = null;
    private totalSurfaceAreaElement: HTMLElement | null = null;
    private fpsElement: HTMLElement | null = null;

    /**
     * "It's a feature, not a bug." - Every programmer
     * "It just works" - Todd Howard
     * Basically at some point when I implemented the pool,
     * I would pull an object from the pool array without properly handling in which array they would be
     * Causing a 'funny' bug where eventually new shapes pulled from the pool would be faster than the rest
     * Since they would appear more than once in the same array when handling gravity
     */
    private readonly funnnyFeatureParam: string = "funnyFeature";
    private enableFunnyFeature: boolean = false;

    constructor()
    {
        super('ShapeSpawnerScene');

        //
        const paramVal = Utils.GetURLParam(this.funnnyFeatureParam);
        if (paramVal !== null)
            this.enableFunnyFeature = paramVal;

        //
        this.shapePool = new ShapeGameObjectPool(this.individualShapePoolSize);

        // Mask
        const maskContext: GraphicsContext = new GraphicsContext();
        maskContext
            .rect(0, 0, PixiEngine.CanvasResolution.x, PixiEngine.CanvasResolution.y - 50)
            .fill({ alpha: 0 });

        this.mask = new Graphics(maskContext);
        this.mask.label = "Mask";

        this.maskArea = new Graphics(maskContext);
        this.maskArea.label = "MaskArea";

        this.maskArea.eventMode = 'static';
        this.maskArea.on("pointerdown", (event): void => { console.log(event.client); this.SpawnRandomShape(new Point(event.client.x, event.client.y)); });

        this.CurrentContainer.addChild(this.mask);
        this.CurrentContainer.addChild(this.maskArea);

        //
        this.shapeCountElement = window.document.getElementById(this.shapeCountElementID);
        this.totalSurfaceAreaElement = window.document.getElementById(this.totalSurfaceAreaElementID);
        this.fpsElement = window.document.getElementById(this.fpsElementID);
    }

    public Update(deltaTime: number): void
    {
        this.TrySpawnShape(deltaTime);
        this.ApplyGravityToShapes(deltaTime);
        this.UpdateMaskSize();
        if (this.fpsElement !== null)
            this.fpsElement.textContent = `FPS: ${Math.floor(PixiEngine.CurrentFPS)}`
    }

    private TrySpawnShape(deltaTime: number)
    {
        this.timeSinceLastSpawn += deltaTime;
        if (this.timeSinceLastSpawn >= this.SpawnInterval)
        {
            const amountToSpawn: number = Math.floor(this.timeSinceLastSpawn / this.SpawnInterval);
            for (let index = 0; index < amountToSpawn; index++)
            {
                this.SpawnRandomShape();
            }

            this.timeSinceLastSpawn = 0;
        }
    }

    private get SpawnInterval(): number
    {
        return 1 / this._shapesPerSecond;
    }

    private ApplyGravityToShapes(deltaTime: number)
    {
        const bounds = PixiEngine.CanvasBounds;

        for (const gameObject of this.GameObjects)
        {
            if (this.IsObjectOutOfBounds(gameObject, bounds))
            {
                this.shapePool.DespawnShape(gameObject);
                continue;
            }
            gameObject.transform.position.y += this._gravity * deltaTime;
        }
    }

    private UpdateMaskSize(): void
    {
        this.mask.scale.set(1);
        this.mask.width = PixiEngine.CanvasResolution.x;
        this.mask.height = PixiEngine.CanvasResolution.y - this.maskHeightReduction;
    }

    private UpdateTextCounters(shapeCount: number, totalSurfaceArea: number): void
    {
        if (this.shapeCountElement !== null)
            this.shapeCountElement.textContent = `Number of current shapes: ${shapeCount}`;
        if (this.totalSurfaceAreaElement !== null)
            this.totalSurfaceAreaElement.textContent = `Surface area occupied by shapes: ${totalSurfaceArea}`;
    }

    private IsObjectOutOfBounds(gameObject: GameObject, bounds: Rectangle)
    {
        return gameObject.transform.position.y > bounds.bottom + gameObject.graphics.height;
    }

    public SpawnRandomShape(posOverride: Point | null = null): void
    {
        const randomColor: string = Utils.GetRandomEnumElement(Colors, "string");
        const go: GameObject = this.shapePool.SpawnShape(Utils.GetRandomEnumElement(ShapeType), this);

        const bounds: Rectangle = PixiEngine.CanvasBounds;
        const randomPos: Point = new Point(
            Utils.Lerp(bounds.left + go.graphics.width, bounds.right - go.graphics.width, Math.random()),
            bounds.top - go.graphics.height);

        let pos: Point = randomPos;
        if (posOverride !== null)
            pos.set(posOverride.x - go.graphics.width, posOverride.y - go.graphics.height);

        go.graphics.tint = randomColor;
        go.transform.position = pos;
        go.transform.scale.set(1.5);
        go.graphics.mask = this.mask;

        if (this.enableFunnyFeature)
            this.AddGameObject(go);
    }

    public AddGameObject(gameObject: GameObject): void
    {
        super.AddGameObject(gameObject);

        this.UpdateTextCounters(this.GameObjects.length, this.TotalSurfaceArea);
    }

    public RemoveGameObject(gameObject: GameObject): void
    {
        super.RemoveGameObject(gameObject);

        this.UpdateTextCounters(this.GameObjects.length, this.TotalSurfaceArea);
    }
}
