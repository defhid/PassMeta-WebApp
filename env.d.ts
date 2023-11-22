interface ImportMetaEnv {
    readonly VITE_PASSMETA_API?: string;
    readonly DEV?: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
