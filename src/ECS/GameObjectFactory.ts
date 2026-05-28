import { GameObject } from "./GameObject";
import { Graphics, Container } from 'pixi.js';

export class GameObjectFactory {
    public static CreateGameObject(name: string, graphics: Graphics, container: Container): GameObject {
        let go: GameObject = new GameObject(name, graphics);
        container.addChild(go.graphics);
        return go;
    }
}