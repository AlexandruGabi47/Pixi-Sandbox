import { GameObject } from "../ECS/GameObject";
import { Scene } from "../Scene/Scene";
import { Utils } from "../Core/Utils";
import { PixiEngine } from "../Core/PixiEngine";
import { Graphics, Point, Rectangle } from "pixi.js"
import { ShapeGameObjectPool } from "./ShapeGameObjectPool";
import { ShapeType } from "../Shapes/ShapeGraphicsContext";

export enum Colors
{
    Red = 0xDD1111,
    Green = 0x11DD11,
    Blue = 0x1111DD,
    Yellow = 0xDDDD11
}

export class ShapeSpawnerScene extends Scene
{
    private _shapesPerSecond: number = 5;
    private _gravity: number = 200;

    private readonly shapePool: ShapeGameObjectPool = new ShapeGameObjectPool('ShapeGameObjectPool');
    private readonly individualShapePoolSize: number = 10;

    private timeSinceLastSpawn: number = 0;

    private mask: Graphics = new Graphics();

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

    public Init(): void
    {
        //
        const paramVal = Utils.GetURLParam(this.funnnyFeatureParam);
        if (paramVal !== null)
            this.enableFunnyFeature = paramVal;

        //
        this.shapePool.InitPool(this.individualShapePoolSize)

        // Mask
        this.mask
            .rect(0, 0, 1000, 1000)
            .fill({
                alpha: 0
            })
            .label = "Mask";
        this.CurrentContainer.addChild(this.mask);

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
            this.fpsElement.textContent = `FPS: ${Math.floor(PixiEngine.GetFPS())}`
    }

    private TrySpawnShape(deltaTime: number)
    {
        this.timeSinceLastSpawn += deltaTime;
        if (this.timeSinceLastSpawn >= this.SpawnInterval)
        {
            const amountToSpawn: number = Math.floor(this.timeSinceLastSpawn / this.SpawnInterval);
            for (let index = 0; index < amountToSpawn; index++) {
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
        const bounds = PixiEngine.GetCanvasBounds();

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

    public SpawnRandomShape(): void
    {
        const randomColor: number = Utils.GetRandomEnumElement(Colors);
        const go: GameObject = this.shapePool.SpawnShape(Utils.GetRandomEnumElement(ShapeType), this);

        const bounds: Rectangle = PixiEngine.GetCanvasBounds();
        const randomPos: Point = new Point(
            Utils.Lerp(bounds.left + go.graphics.width, bounds.right - go.graphics.width, Math.random()),
            bounds.top - go.graphics.height);

        go.graphics.tint = randomColor;
        go.transform.position = randomPos;
        //go.graphics.mask = this.mask;

        if (this.enableFunnyFeature)
            this.AddGameObject(go);
    }

    public AddGameObject(gameObject: GameObject): void
    {
        super.AddGameObject(gameObject);

        this.UpdateTextCounters(this.GameObjects.length, 0);
    }

    public RemoveGameObject(gameObject: GameObject): void
    {
        super.RemoveGameObject(gameObject);

        this.UpdateTextCounters(this.GameObjects.length, 0);
    }
}
