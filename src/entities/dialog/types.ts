/**
 * Common options for all dialogs.
 */
export interface DialogOptions {
    title?: string;
}

/**
 * Options for asking password.
 */
export interface AskTextOptions extends DialogOptions {
    question: string;
}
