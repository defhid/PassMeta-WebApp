interface AppConfig {
    DEV: boolean;
    PASSMETA_API: string;
}

export function useAppConfig(): AppConfig {
    return {
        DEV: import.meta.env.DEV ?? false,
        PASSMETA_API: import.meta.env.VITE_PASSMETA_API ?? "",
    };
}
