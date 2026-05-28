export class Utils
{
    public static GetRandomEnumElement<T extends object>(enumObj: T) {
        const values = Object.values(enumObj)
            .filter(v => typeof v === "number");

        return values[Math.floor(Math.random() * values.length)];
    }

    public static Lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
    }
}