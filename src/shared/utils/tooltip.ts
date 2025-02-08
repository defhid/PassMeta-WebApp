import { useRouter } from "vue-router";
import { nextTick, reactive, ref, watch } from "vue";

/**
 * Composable for creating options for tooltip.
 */
export function useTooltip() {
    const router = useRouter();
    const disabled = ref(false);

    // crutch because of a bug in vuetify, when tooltip is not removed after navigation
    watch(router.currentRoute, () => {
        disabled.value = true;
        nextTick().then(() => (disabled.value = false));
    });

    function describeTooltip(
        text: string,
        options?: { delay?: number; location?: "top" | "bottom" | "left" | "right" | string },
    ) {
        return reactive({
            text,
            disabled,
            openDelay: options?.delay ?? 700,
            location: options?.location,
        });
    }

    return { describeTooltip };
}
