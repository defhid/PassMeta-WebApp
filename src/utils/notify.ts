export interface NotifyBaseOptions {
    header?: string;
}

// TODO
export class Notify {
    static error(message: string, options?: NotifyBaseOptions): void {
        alert(message);
    }

    static warning(message: string, options?: NotifyBaseOptions): void {
        alert(message);
    }

    static info(message: string, options?: NotifyBaseOptions): void {
        alert(message);
    }
}
