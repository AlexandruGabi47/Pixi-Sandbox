import { Container } from 'pixi.js'
import { GameObject } from '../ECS/GameObject';

export abstract class Scene
{
    private _currentContainer: Container;
    private _gameObjects: GameObject[] = [];

    constructor(label: string)
    {
        this._currentContainer = new Container({ label: label });
    }

    public Init(): void { }

    public set CurrentContainer(container: Container)
    {
        this._currentContainer = container;
    }

    public get CurrentContainer(): Container
    {
        return this._currentContainer;
    }

    public Update(deltaTime: number): void
    {
        for (const gameObject of this._gameObjects)
        {
            gameObject.Update(deltaTime);
        }
    }

    public Render(): void
    {
        for (const gameObject of this._gameObjects)
        {
            gameObject.Render();
        }
    }

    public AddGameObject(gameObject: GameObject): void
    {
        this._gameObjects.push(gameObject);
    }

    public RemoveGameObject(gameObject: GameObject): void
    {
        const index = this._gameObjects.indexOf(gameObject);
        if (index !== -1)
        {
            this._gameObjects.splice(index, 1);
        }
    }

    public get GameObjects(): GameObject[]
    {
        return this._gameObjects;
    }
}