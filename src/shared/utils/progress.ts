import type { Ref } from "vue";

const progressLockers = new Map<Ref<boolean>, number>();

/**
 * Wrap function with progress indicator.
 */
export const usingProgress =
    <TFunction extends (...args: any[]) => any>(
        indicator: Ref<boolean>,
        fn: TFunction,
    ): ((
        ...args: Parameters<TFunction>
    ) => Promise<ReturnType<TFunction> extends Promise<infer TReturn> ? TReturn : ReturnType<TFunction>>) =>
    async (...args) => {
        indicator.value = true;
        progressLockers.set(indicator, (progressLockers.get(indicator) ?? 0) + 1);

        try {
            return await fn(...args);
        } finally {
            const currentLock = progressLockers.get(indicator) ?? 1;

            if (currentLock === 1) {
                progressLockers.delete(indicator);
                indicator.value = false;
            } else {
                progressLockers.set(indicator, currentLock - 1);
            }
        }
    };
