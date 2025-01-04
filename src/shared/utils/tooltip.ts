/**
 * Method for creating options for tooltip.
 */
export function describeTooltip(
    text: string,
    options?: { delay?: number; location?: "top" | "bottom" | "left" | "right" | string },
) {
    return { text, "open-delay": options?.delay ?? 700, location: options?.location };
}
