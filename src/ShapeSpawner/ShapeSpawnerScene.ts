import { GameObject } from "../ECS/GameObject";
import { Scene } from "../Scene/Scene";
import { Utils } from "../Core/Utils";
import { PixiEngine } from "../Core/PixiEngine";
import { Graphics, GraphicsContext, Point, Rectangle } from "pixi.js"
import { ShapeGameObjectPool } from "./ShapeGameObjectPool";
import { ShapeType } from "../Shapes/ShapeGraphicsContext";
import { HTMLNumberStepper } from "../Elements/HTMLNumberStepper";

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
    private shapesPerSecond: number = 1;
    private gravity: number = 200;

    private readonly minSPS: number = 1;
    private readonly minGravity: number = 100;

    private readonly shapePool: ShapeGameObjectPool;
    private readonly individualShapePoolSize: number = 10;

    private timeSinceLastSpawn: number = 0;

    private spawnArea: Graphics;
    private mask: Graphics;
    private readonly maskHeightReduction: number = 10;

    private shapeCountElement: HTMLElement | null = null;
    private totalSurfaceAreaElement: HTMLElement | null = null;
    private fpsElement: HTMLElement | null = null;

    private shapesPerSecondNumberStepper: HTMLNumberStepper;
    private gravityNumberStepper: HTMLNumberStepper;

    private spsTextElement: HTMLElement | null;
    private gravityTextElement: HTMLElement | null;

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
            .rect(0, 0, PixiEngine.CanvasResolution.x, PixiEngine.CanvasResolution.y - this.maskHeightReduction)
            .fill({ alpha: 0 });

        this.mask = new Graphics(maskContext);
        this.mask.label = "Mask";

        this.spawnArea = new Graphics(maskContext);
        this.spawnArea.label = "SpawnArea";

        this.spawnArea.eventMode = 'static';
        this.spawnArea.on("pointerdown", (event): void => { console.log(event.client); this.SpawnRandomShape(new Point(event.client.x, event.client.y)); });

        this.CurrentContainer.addChild(this.mask);
        this.CurrentContainer.addChild(this.spawnArea);

        //
        this.shapeCountElement = window.document.getElementById("shapeCount");
        this.totalSurfaceAreaElement = window.document.getElementById("totalSurfaceArea");
        this.fpsElement = window.document.getElementById("fps");

        this.spsTextElement = window.document.getElementById("spsText");
        this.gravityTextElement = window.document.getElementById("gravityText");

        this.shapesPerSecondNumberStepper = new HTMLNumberStepper("decreaseSPS", "increaseSPS", 1, (amount) =>
        {
            this.shapesPerSecond += amount;
            if (this.shapesPerSecond < this.minSPS)
                this.shapesPerSecond = this.minSPS;
            this.UpdateSPSText();
        });
        this.gravityNumberStepper = new HTMLNumberStepper("decreaseGravity", "increaseGravity", 10, (amount) =>
        {
            this.gravity += amount;
            if (this.gravity < this.minGravity)
                this.gravity = this.minGravity;
            this.UpdateGravityText();
        });
        
        this.UpdateSPSText();
        this.UpdateGravityText();
    }

    public Update(deltaTime: number): void
    {
        this.TrySpawnShape(deltaTime);
        this.ApplyGravityToShapes(deltaTime);
        this.UpdateMaskAndSpawn();

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
        return 1 / this.shapesPerSecond;
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
            gameObject.transform.position.y += this.gravity * deltaTime;
        }
    }

    private UpdateMaskAndSpawn(): void
    {
        this.mask.scale.set(1);
        this.mask.width = PixiEngine.CanvasResolution.x;
        this.mask.height = PixiEngine.CanvasResolution.y - this.maskHeightReduction;

        this.spawnArea.scale.set(1);
        this.spawnArea.width = PixiEngine.CanvasResolution.x;
        this.spawnArea.height = PixiEngine.CanvasResolution.y - this.maskHeightReduction;
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
        go.transform.scale.set(1.1);
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

    private UpdateTextCounters(shapeCount: number, totalSurfaceArea: number): void
    {
        if (this.shapeCountElement !== null)
            this.shapeCountElement.textContent = `Number of current shapes: ${shapeCount}`;
        if (this.totalSurfaceAreaElement !== null)
            this.totalSurfaceAreaElement.textContent = `Surface area occupied by shapes: ${totalSurfaceArea}`;
    }

    private UpdateSPSText(): void
    {
        if (this.spsTextElement !== null)
            this.spsTextElement.textContent = `Shapes/s: ${this.shapesPerSecond}`;
    }

    private UpdateGravityText(): void
    {
        if (this.gravityTextElement !== null)
            this.gravityTextElement.textContent = `Gravity: ${this.gravity}`;
    }
}
