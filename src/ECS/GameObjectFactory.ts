import { GameObject } from "./GameObject";
import { Graphics } from 'pixi.js';

export class GameObjectFactory {
    private static _count: number = 0;

    public static get Count(): number {
        return GameObjectFactory._count;
    }

    public static CreateGameObject(name: string, graphics: Graphics): GameObject {
        const go: GameObject = new GameObject(name, graphics);
        this._count++;
        return go;
    }
}