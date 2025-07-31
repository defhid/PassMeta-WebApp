/**
 * Check binary flag intersection.
 */
export function hasFlag<T extends number>(value: T, flag: T): boolean {
    return (value & flag) === flag;
}
