/**
 * Normalize specified url to absolute location.
 */
export function normalizeExternalUrl(url: string) {
    if (url.startsWith("http") || url.startsWith("https")) {
        return url;
    }

    return "https://" + url.replace(/^\/+/g, "");
}
