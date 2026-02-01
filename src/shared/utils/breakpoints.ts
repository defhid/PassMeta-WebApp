import { createGlobalState } from "@vueuse/shared";
import { useBreakpoints } from "@vueuse/core";

/**
 * Reactive breakpoints.
 */
export const useMobileFirstBreakpoints = createGlobalState(() => useBreakpoints({ md: "768px" }));
