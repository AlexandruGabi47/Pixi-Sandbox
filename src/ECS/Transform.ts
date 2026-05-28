import * as PIXI from 'pixi.js'

export class Transform2D {
    private _position: PIXI.Point = new PIXI.Point();
    private _rotation: number = 0;
    private _scale: PIXI.Point = new PIXI.Point(1, 1);

    get position(): PIXI.Point {
        return this._position;
    }

    set position(newPos: PIXI.Point) {
        this._position = newPos;
    }

    get rotation(): number {
        return this._rotation;
    }

    set rotation(newRot: number) {
        this._rotation = newRot;
    }

    get scale(): PIXI.Point {
        return this._scale;
    }

    set scale(newScale: PIXI.Point) {
        this._scale = newScale;
    }
}
