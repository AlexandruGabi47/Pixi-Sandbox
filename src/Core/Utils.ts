export class Utils
{
    public static GetAllEnumElements<T extends object>(enumObj: T, type: string = "number") {
        return Object.values(enumObj).filter(v => typeof v === type);
    }

    public static GetRandomEnumElement<T extends object>(enumObj: T, type: string = "number") {
        const values = Utils.GetAllEnumElements(enumObj, type);

        return values[Math.floor(Math.random() * values.length)];
    }

    public static Lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
    }

    public static GetURLParam(param: string): any {
        const params = new URLSearchParams(window.location.search);

        return params.get(param);
    }
}