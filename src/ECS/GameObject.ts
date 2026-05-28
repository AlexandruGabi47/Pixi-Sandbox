import { Container, Graphics } from 'pixi.js';
import { Transform2D } from './Transform'
import { PixiEngine } from '../Core/PixiEngine';
import type { Scene } from '../Scene/Scene';

export class GameObject
{
    private _name: string;
    private _enabled: boolean = true;

    private _currentScene: Scene | null = null;

    public readonly transform: Transform2D = new Transform2D();
    public readonly graphics: Graphics;

    public constructor(name: string, graphics: Graphics)
    {
        this._name = name;
        this.graphics = graphics;
        this.graphics.label = name;
    }

    public set Name(name: string)
    {
        this._name = name;
    }

    public get Name(): string
    {
        return this._name;
    }

    public set Enabled(enabled: boolean)
    {
        this.graphics.visible = enabled;
        this._enabled = enabled;
    }

    public get Enabled(): boolean
    {
        return this._enabled;
    }

    public set CurrentScene(scene: Scene)
    {
        this._currentScene?.RemoveGameObject(this);
        this._currentScene = scene;
        this._currentScene.AddGameObject(this);
    }

    public get CurrentScene(): Scene | null
    {
        return this._currentScene;
    }

    // Currently not being used
    public Update(deltaTime: number): void { }

    public Render(): void
    {
        if (!this.Enabled)
            return;

        this.graphics.position.set(this.transform.position.x, this.transform.position.y);
        this.graphics.rotation = this.transform.rotation;
        this.graphics.scale.set(this.transform.scale.x, this.transform.scale.y);
    }

    public SwitchParentTo(newParent: Container): void
    {
        this.graphics.parent?.removeChild(this.graphics);
        newParent.addChild(this.graphics);
    }

    public Destroy(): void
    {
        this.graphics.destroy();
        PixiEngine.CurrentScene.RemoveGameObject(this);
    }

    /**
     * Needs update, not sure how to get the surface area right now
     * Or the pixels or something from the graphic to help with calculating it
     */
    public GetSurfaceArea(): number
    {
        return this.graphics.width * this.graphics.height;
    }
}
