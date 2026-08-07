import { createGlobalState } from "@vueuse/shared";
import { ref } from "vue";

export const useOnline = createGlobalState(() => {
    const isOnline = ref(false);

    return { isOnline };
});
