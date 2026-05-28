import { Graphics, GraphicsContext } from 'pixi.js'

export enum ShapeType {
    Triangle, Square, Pentagon, Hexagon, Circle, Ellipse, Star
}

export class ShapeGraphicsContext {
    private static GraphicsContext: Map<ShapeType, GraphicsContext> = new Map([
        [ShapeType.Triangle, new GraphicsContext().rect(0, 0, 100, 100).fill(0xFFFFFF)],
        [ShapeType.Square, new GraphicsContext().rect(0, 0, 100, 100).fill(0xFFFFFF)],
        [ShapeType.Pentagon, new GraphicsContext().rect(0, 0, 100, 100).fill(0xFFFFFF)],
        [ShapeType.Hexagon, new GraphicsContext().rect(0, 0, 100, 100).fill(0xFFFFFF)],
        [ShapeType.Circle, new GraphicsContext().circle(0, 0, 50).fill(0xFFFFFF)],
        [ShapeType.Ellipse, new GraphicsContext().ellipse(0, 0, 50, 25).fill(0xFFFFFF)],
        [ShapeType.Star, new GraphicsContext().star(0, 0, 5, 50, 25).fill(0xFFFFFF)]
    ]);

    public static GetShapeGraphics(shape: ShapeType): Graphics {
        if (!ShapeGraphicsContext.GraphicsContext.has(shape)) {
            throw new Error(`Shape graphics context for shape ${ShapeType[shape]} not found.`);
        }

        let g: Graphics = new Graphics(this.GraphicsContext.get(shape));
        g.eventMode = 'static';
        return g;
    }
}