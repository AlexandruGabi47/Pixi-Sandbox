import { Scene } from "../Scene/Scene";
import { ShapeGraphicsContext, ShapeType } from "../Shapes/ShapeGraphicsContext";
import { Utils } from "../Core/Utils";
import { GameObjectFactory } from "../ECS/GameObjectFactory";
import { GameObject } from "../ECS/GameObject";
import { PixiEngine } from "../Core/PixiEngine";

export class ShapeGameObjectPool extends Scene
{
    /**
     * @param initialPoolCount the initial count for each shape type
     */
    constructor(initialPoolCount: number)
    {
        super("ShapeGameObjectPool");
        
        PixiEngine.AddContainer(this.CurrentContainer)

        Utils.GetAllEnumElements(ShapeType).forEach(shape =>
        {
            for (let index = 0; index < initialPoolCount; index++)
            {
                this.CreateShape(shape);
            }
        });
    }

    private CreateRandomShape(): GameObject
    {
        const randomShape: number = Utils.GetRandomEnumElement(ShapeType);
        return this.CreateShape(randomShape);
    }

    private CreateShape(shapeType: ShapeType): GameObject
    {
        const go: GameObject = GameObjectFactory.CreateGameObject(
            `${ShapeType[shapeType]}${GameObjectFactory.Count}`,
            ShapeGraphicsContext.GetShapeGraphics(shapeType));
        
        this.AddToPool(go);

        return go;
    }

    private GetShapeGameObject(shapeType: ShapeType): GameObject
    {
        const go: GameObject | null = this.GameObjects.find(go => go.Name.includes(ShapeType[shapeType])) ?? null

        if (go === null)
            return this.CreateRandomShape();

        return go;
    }

    public SpawnShape(shapeType: ShapeType, scene: Scene): GameObject
    {
        const go: GameObject | null = this.GetShapeGameObject(shapeType);

        this.RemoveFromPool(go, scene);

        go.graphics.on("pointerdown", (event: Event): void => this.onMouseDown(event, go));

        return go;
    }

    public DespawnShape(go: GameObject): void
    {
        this.AddToPool(go);

        go.graphics.off("pointerdown", (event: Event): void => this.onMouseDown(event, go));
    }

    private AddToPool(go: GameObject)
    {
        go.CurrentScene = this;
        go.SwitchParentTo(this.CurrentContainer);
        go.Enabled = false;
    }

    private RemoveFromPool(go: GameObject, scene: Scene)
    {
        go.CurrentScene = scene;
        go.SwitchParentTo(scene.CurrentContainer);
        go.Enabled = true;
    }

    private onMouseDown(event: Event, go: GameObject): void
    {
        this.DespawnShape(go);
    }
}
