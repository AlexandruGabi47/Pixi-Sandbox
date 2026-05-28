import { Graphics, GraphicsContext } from 'pixi.js'
import type { PointData } from 'pixi.js'

export enum ShapeType {
    Triangle,
    Square,
    Pentagon,
    Hexagon,
    Circle,
    Ellipse,
    Star
}

export class ShapeGraphicsContext {

    private static TrianglePD: PointData[] = [{x: -35, y: 35}, {x: 0, y: -35}, {x: 35, y: 35}];
    private static PentagonPD: PointData[] = [{x: -30, y: -5}, {x: 0, y: -25}, {x: 30, y: -5}, {x: 23, y: 35}, {x: -23, y: 35}];
    private static HexagonPD: PointData[] = [{x: -30, y: 0}, {x: -15, y: -25}, {x: 15, y: -25}, {x: 30, y: 0}, {x: 15, y: 25}, {x: -15, y: 25}];

    private static GraphicsContext: Map<ShapeType, GraphicsContext> = new Map([
        [ShapeType.Triangle, new GraphicsContext().poly(ShapeGraphicsContext.TrianglePD).fill(0xFFFFFF)],
        [ShapeType.Square, new GraphicsContext().rect(0, 0, 60, 60).fill(0xFFFFFF)],
        [ShapeType.Pentagon, new GraphicsContext().poly(ShapeGraphicsContext.PentagonPD).fill(0xFFFFFF)],
        [ShapeType.Hexagon, new GraphicsContext().poly(ShapeGraphicsContext.HexagonPD).fill(0xFFFFFF)],
        [ShapeType.Circle, new GraphicsContext().circle(0, 0, 35).fill(0xFFFFFF)],
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
