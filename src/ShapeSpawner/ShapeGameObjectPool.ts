import { Scene } from "../Scene/Scene";
import { ShapeGraphicsContext, ShapeType } from "../Shapes/ShapeGraphicsContext";
import { Utils } from "../Core/Utils";
import { GameObjectFactory } from "../ECS/GameObjectFactory";
import { GameObject } from "../ECS/GameObject";
import { PixiEngine } from "../Core/PixiEngine";

export class ShapeGameObjectPool extends Scene {
    /**
     * @param initialPoolCount the initial count for each shape type
     */
    public InitPool(initialPoolCount: number): void
    {
        Utils.GetAllEnumElements(ShapeType).forEach(shape => {
            for (let index = 0; index < initialPoolCount; index++) {
                this.CreateShape(shape);
            }
        });

        PixiEngine.AddContainer(this.CurrentContainer)
    }

    private CreateRandomShape(): GameObject {
        let randomShape: number = Utils.GetRandomEnumElement(ShapeType);
        return this.CreateShape(randomShape);
    }

    private CreateShape(shapeType: ShapeType): GameObject
    {
        let go: GameObject = GameObjectFactory.CreateGameObject(
            `${ShapeType[shapeType]}${GameObjectFactory.Count}`,
            ShapeGraphicsContext.GetShapeGraphics(shapeType));

        return go;
    }

    private GetShapeGameObject(shapeType: ShapeType): GameObject
    {
        let go: GameObject | null = this.GameObjects.find(go => go.Name.includes(ShapeType[shapeType])) ?? null

        if (go === null)
        {
            let newGo: GameObject = this.CreateRandomShape();
            newGo.CurrentScene = this;

            return newGo;
        }

        return go;
    }

    public SpawnShape(shapeType: ShapeType, scene: Scene): GameObject
    {
        let go: GameObject | null = this.GetShapeGameObject(shapeType);

        go.CurrentScene = scene;

        go.SwitchParentTo(scene.CurrentContainer);

        go.graphics.on("pointerup", (event: Event): void => this.onMouseUp(event, go));

        go.Enabled = true;
        
        return go;
    }

    public DespawnShape(go: GameObject): void
    {
        go.CurrentScene = this;

        go.SwitchParentTo(this.CurrentContainer);

        go.graphics.off("pointerup", (event: Event): void  => this.onMouseUp(event, go));

        go.Enabled = false;
    }

    private onMouseUp(event: Event, go: GameObject): void
    {
        this.DespawnShape(go);
    }
}
