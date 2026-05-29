export class HTMLNumberStepper
{
    private decreaseButton: HTMLButtonElement | null;
    private increaseButton: HTMLButtonElement | null;

    private stepsPerClick: number;

    public callback: (amount: number) => void;

    constructor(decreaseButtonID: string, increaseButtonID: string, stepsPerClick: number = 1, callback: (amount: number) => void)
    {
        this.decreaseButton = window.document.getElementById(decreaseButtonID) as HTMLButtonElement;
        this.increaseButton = window.document.getElementById(increaseButtonID) as HTMLButtonElement;
        this.stepsPerClick = stepsPerClick;
        this.callback = callback;

        this.decreaseButton.addEventListener("pointerdown", () => this.DecreaseStep(callback));

        this.increaseButton.addEventListener("pointerdown", () => this.IncreaseStep(callback));
    }

    private DecreaseStep(callback: (amount: number) => void)
    {
        callback(-this.stepsPerClick);
    }

    private IncreaseStep(callback: (amount: number) => void)
    {
        callback(this.stepsPerClick);
    }
}