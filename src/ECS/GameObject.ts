import { Graphics } from 'pixi.js';
import { Transform2D } from './Transform'
import { PixiEngine } from '../Core/PixiEngine';

export class GameObject {
    public name: string;

    public readonly transform: Transform2D = new Transform2D();
    public graphics: Graphics;

    public constructor(name: string, graphics: Graphics) {
        this.name = name;
        this.graphics = graphics;
        this.graphics.label = name;

        this.graphics.on("pointerup", this.onMouseUp.bind(this));
    }

    public SetGraphics(graphics: Graphics): void
    {
        this.graphics.destroy();
        this.graphics = graphics;
    }

    public Update(deltaTime: number): void { }

    public Render(): void {
        this.graphics.position.set(this.transform.position.x, this.transform.position.y);
        this.graphics.rotation = this.transform.rotation;
        this.graphics.scale.set(this.transform.scale.x, this.transform.scale.y);
    }

    private onMouseUp(event: Event): void
    {
        this.Destroy();
    }

    public Destroy(): void
    {
        this.graphics.destroy();
        PixiEngine.CurrentScene.RemoveGameObject(this);
    }
}
