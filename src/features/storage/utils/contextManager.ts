import { PassFileType, type PwdSection } from "~entities/passfile";
import { createGlobalState } from "@vueuse/shared";
import { createPassFileContext, type PassFileContext } from "./context";
import { useLocalStorageCounter } from "./counter.ts";

/**
 * A manager for working with passfile contexts.
 */
export interface PassFileContextManager {
    /**
     * All current initialized contexts.
     */
    contexts: PassFileContext<unknown>[];

    /**
     * Initialize context by passfile type, or get current initialized context.
     */
    resolveContext(type: PassFileType): PassFileContext<unknown>;
}

/**
 * Use global manager for working with passfile contexts.
 */
export const usePassFileContextManager = createGlobalState((): PassFileContextManager => {
    const contexts: PassFileContext<unknown>[] = [];
    const localIdCounter = useLocalStorageCounter("passFileLocalId");
    const contentFactory = () => [];

    function resolveContext(type: PassFileType): PassFileContext<unknown> {
        let context = contexts.find((x) => x.passFileType === type);

        if (context == null) {
            context = createPassFileContext({ type, localIdCounter, contentFactory });
            contexts.push(context);
        }

        return context;
    }

    return {
        contexts,
        resolveContext,
    };
});

/**
 * Use global context for working with passfiles.
 */
export const usePwdPassFileContext = (): PassFileContext<PwdSection[]> => {
    const { resolveContext } = usePassFileContextManager();

    return resolveContext(PassFileType.Pwd) as PassFileContext<PwdSection[]>;
};
