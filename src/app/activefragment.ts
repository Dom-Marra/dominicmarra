export class Activefragment {

    private fragment: string;
    private wasRouted: boolean;

    constructor(public fragName: string, public routed: boolean) {
        this.fragment = fragName;
        this.wasRouted = routed;
    }

    public getFragment(): string {
        return this.fragment;
    }

    public getWasRouted(): boolean {
        return this.wasRouted;
    }
}
