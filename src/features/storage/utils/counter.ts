import { type Ref, ref, watch } from "vue";

/**
 * Use counter with localStorage sync.
 */
export const useLocalStorageCounter = (key: string): Ref<number> => {
    const parseCounterValue = (rawValue: string | null | undefined) => Number(rawValue || "0") || 0;

    const counter = ref(parseCounterValue(window.localStorage.getItem(key)));

    watch(counter, (val) => window.localStorage.setItem(key, val.toString()));

    window.addEventListener("storage", (event) => {
        if (event.key === key) {
            counter.value = parseCounterValue(event.newValue);
        }
    });

    return counter;
};
