/**
 * Simple result.
 */
export interface IResult<TData = never> {
    /**
     * Result is success.
     */
    readonly ok: boolean;

    /**
     * Result is failure.
     */
    readonly bad: boolean;

    /**
     * Result optional data.
     * @remarks Must be non-null when OK.
     */
    readonly data?: TData;
}

/**
 * Simple result.
 */
export interface IDetailedResult<TData = never> extends IResult<TData> {
    /**
     * Result optional message.
     * @remarks Must be non-null when BAD.
     */
    readonly message?: string;
}

/**
 * Result factory.
 */
export class Result {
    /**
     * Make success result with optional message.
     */
    static success(): IDetailedResult;
    /**
     * Make success result with data.
     */
    static success<TData>(data: TData): IDetailedResult;
    static success<TData = never>(data?: TData): IDetailedResult<TData> {
        return data === undefined ? cachedSuccess : new ResultModel(true, undefined, data);
    }

    /**
     * Make failure result.
     */
    static failure(): IResult;
    /**
     * Make failure result with message.
     */
    static failure(message: string): IDetailedResult;
    /**
     * Make failure result with default data.
     */
    static failure<TData>(): IResult<TData>;
    /**
     * Make failure result with default data and message.
     */
    static failure<TData>(message: string): IDetailedResult<TData>;
    static failure<TData>(message?: string): IDetailedResult<TData> {
        return message === undefined ? cachedFailure : new ResultModel(false, message);
    }
}

class ResultModel<TData = never> implements IDetailedResult<TData> {
    constructor(
        public readonly ok: boolean,
        public readonly message?: string,
        public readonly data?: TData,
    ) {}

    public get bad(): boolean {
        return !this.ok;
    }
}

const cachedSuccess = Object.freeze(new ResultModel(true));
const cachedFailure = Object.freeze(new ResultModel(false));
