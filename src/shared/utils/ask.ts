export interface AskBaseOptions {
    header?: string;
}

// TODO
export class Ask {
    static confirm(message: string, _options?: AskBaseOptions): Promise<boolean> {
        const answer = confirm(message);
        return Promise.resolve(answer);
    }
}
