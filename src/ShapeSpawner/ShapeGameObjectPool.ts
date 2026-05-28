import { Scene } from "../Scene/Scene";
import { ShapeGraphicsContext, ShapeType } from "../Shapes/ShapeGraphicsContext";
import { Utils } from "../Core/Utils";
import { GameObjectFactory } from "../ECS/GameObjectFactory";
import { GameObject } from "../ECS/GameObject";


export class ShapeGameObjectPool extends Scene {
    public async Init(initialPoolCount: number): Promise<void>
    {
        for (let index = 0; index < initialPoolCount; index++) {
            this.AddGameObject(this.CreateRandomShape());
        }
    }

    private CreateRandomShape(): GameObject {
        let randomShape: number = Utils.GetRandomEnumElement(ShapeType);

        return GameObjectFactory.CreateGameObject(
            ShapeType[randomShape],
            ShapeGraphicsContext.GetShapeGraphics(randomShape),
            this.CurrentContainer);
    }

    public SpawnShape(shapeType: ShapeType): GameObject
    {
        return this.GetAllGameObjects().find(go => go.name === ShapeType[shapeType]) ?? this.CreateRandomShape();
    }

    public DespawnShape(gameObject: GameObject): void
    {
        this.CurrentContainer.addChild(gameObject.graphics);
    }
}