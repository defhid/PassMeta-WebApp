interface ImportMetaEnv {
    readonly DEV?: boolean;
    readonly VITE_PRIMEUI_LICENSE?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
