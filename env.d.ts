interface ImportMetaEnv {
    readonly DEV?: boolean;
    readonly VITE_PASSMETA_API?: string;
    readonly VITE_PASSMETA_API_PROXY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
