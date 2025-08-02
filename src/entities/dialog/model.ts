import { createGlobalState } from "@vueuse/shared";
import { defineComponent, h, shallowRef, type VNode } from "vue";
import AskTextDialog from "~entities/dialog/ui/AskTextDialog.vue";
import type { AskTextOptions } from "~entities/dialog/types";

/**
 * Use methods for working with dialogs.
 */
export function useDialogs() {
    const { currentComponents } = useDialogsContainer();

    function askPassword(options: AskTextOptions): Promise<string | null> {
        let resolve: (result: string | null) => void;
        const promise = new Promise<string | null>((res) => (resolve = res));

        const node = h(AskTextDialog, {
            ...options,
            isPassword: true,
            onAnswer: (result: string | null) => onAnswer(result),
        });

        function onAnswer(result: string | null) {
            currentComponents.value = currentComponents.value.filter((x) => x !== node);
            resolve(result);
        }

        currentComponents.value = [...currentComponents.value, node];
        return promise;
    }

    return { askPassword };
}

/**
 * Use container for current dialogs.
 */
export const useDialogsContainer = createGlobalState(() => {
    const currentComponents = shallowRef([] as VNode[]);

    return { currentComponents };
});

/**
 * Component for dialogs containing.
 */
export const DialogsContainer = defineComponent({
    setup() {
        const { currentComponents } = useDialogsContainer();
        return () => currentComponents.value;
    },
});
