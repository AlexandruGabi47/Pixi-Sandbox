import { Point } from 'pixi.js'

export class Transform2D
{
    private _position: Point = new Point();
    private _rotation: number = 0;
    private _scale: Point = new Point(1, 1);

    get position(): Point
    {
        return this._position;
    }

    set position(newPos: Point)
    {
        this._position = newPos;
    }

    get rotation(): number
    {
        return this._rotation;
    }

    set rotation(newRot: number)
    {
        this._rotation = newRot;
    }

    get scale(): Point
    {
        return this._scale;
    }

    set scale(newScale: Point)
    {
        this._scale = newScale;
    }
}
