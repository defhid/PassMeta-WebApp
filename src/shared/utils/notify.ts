export interface NotifyBaseOptions {
    presenter?: "popup" | "window";
    header?: string;
}

// TODO
export class Notify {
    static failure(message: string, options?: NotifyBaseOptions): void {
        alert(message);
    }

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
