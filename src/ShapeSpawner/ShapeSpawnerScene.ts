import { GameObject } from "../ECS/GameObject";
import { Scene } from "../Scene/Scene";
import { Utils } from "../Core/Utils";
import { PixiEngine } from "../Core/PixiEngine";
import { Point, Rectangle } from "pixi.js"
import { ShapeGameObjectPool } from "./ShapeGameObjectPool";
import { ShapeType } from "../Shapes/ShapeGraphicsContext";

export enum Colors
{
    Red = 0xDD1111,
    Green = 0x11DD11,
    Blue = 0x1111DD,
    Yellow = 0xDDDD11
}

export class ShapeSpawnerScene extends Scene {
    private _shapesPerSecond: number = 50;
    private _gravity: number = 200;

    private readonly shapePool: ShapeGameObjectPool = new ShapeGameObjectPool('ShapeGameObjectPool');
    private readonly individualShapePoolSize: number = 10;

    private timeSinceLastSpawn: number = 0;

    /**
     * Not a bug, a feature
     * Basically at some point when I implemented the pool,
     * I would pull an object from the pool array without properly handling in which array they would be
     * Causing a 'funny' bug where eventually new shapes pulled from the pool would be faster than the rest
     * Since they would appear twice in the same array when handling gravity
     */
    private readonly funnnyFeatureParam: string = "funnyFeature";
    private enableFunnyFeature: boolean = false;

    public Init(): void
    {
        const paramVal = Utils.GetURLParam(this.funnnyFeatureParam);
        if (paramVal !== null)
            this.enableFunnyFeature = paramVal;

        this.shapePool.InitPool(this.individualShapePoolSize)
    }

    public Update(deltaTime: number): void {
        this.TrySpawnShape(deltaTime);
        this.ApplyGravityToShapes(deltaTime);
    }

    private TrySpawnShape(deltaTime: number) {
        this.timeSinceLastSpawn += deltaTime;
        if (this.timeSinceLastSpawn >= 1 / this._shapesPerSecond) {
            this.timeSinceLastSpawn = 0;
            this.SpawnRandomShape();
        }
    }

    private ApplyGravityToShapes(deltaTime: number) {
        const bounds = PixiEngine.GetCanvasBounds();

        for (const gameObject of this.GameObjects) {
            if (this.IsObjectOutOfBounds(gameObject, bounds))
            {
                this.shapePool.DespawnShape(gameObject);
                continue;
            }
            gameObject.transform.position.y += this._gravity * deltaTime;
        }
    }

    private IsObjectOutOfBounds(gameObject: GameObject, bounds: Rectangle) {
        return gameObject.transform.position.y > bounds.bottom + gameObject.graphics.height;
    }

    public SpawnRandomShape(): void {
        const randomColor: number = Utils.GetRandomEnumElement(Colors);
        const go: GameObject = this.shapePool.SpawnShape(Utils.GetRandomEnumElement(ShapeType), this);
        
        const bounds: Rectangle = PixiEngine.GetCanvasBounds();
        const randomPos: Point = new Point(
            Utils.Lerp(bounds.left + bounds.width,bounds.right - bounds.width, Math.random()),
            bounds.top - go.graphics.height);

        go.graphics.tint = randomColor;
        go.transform.position = randomPos;

        if (this.enableFunnyFeature)
            this.AddGameObject(go);
    }
}
