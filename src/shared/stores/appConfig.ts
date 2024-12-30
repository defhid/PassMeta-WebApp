import { readonly } from "vue";

export const AppConfig = readonly({
    DEV: import.meta.env.DEV ?? false,
    PASSMETA_API:
        import.meta.env.VITE_PASSMETA_API_PROXY?.toLowerCase() === "true"
            ? "/api"
            : (import.meta.env.VITE_PASSMETA_API ?? ""),
});
