import { TOTP, type TOTPAlgorithm } from "totp-generator";
import { useIntervalFn } from "@vueuse/core";
import { type MaybeRefOrGetter, ref, toValue, watch } from "vue";

/**
 * URL for Time-based One-Time Password calculation.
 */
export type TotpUrl = `otpauth://totp/${string}`;

/**
 * Parsed Time-based One-Time Password calculation config.
 */
export interface TotpParsed {
    readonly secret: string;
    readonly digits: number;
    readonly period: number;
    readonly algorithm: TOTPAlgorithm;
    readonly issuer: string;
    readonly accountId: string;
    readonly url: `otpauth://totp/${string}`;
}

/**
 * Error of parsing TOTP URL.
 */
export class TotpParsingError extends Error {
    constructor(
        message: string,
        public readonly subError: Error,
    ) {
        super(message);
    }
}

/**
 * Parse TOTP URL string to config object.
 */
export function parseTotpUrl(totp: TotpUrl, strict: true): TotpParsed;
export function parseTotpUrl(totp: TotpUrl, strict: false): TotpParsed | null;
export function parseTotpUrl(totp: TotpUrl, strict: boolean): TotpParsed | null {
    try {
        const url = new URL(totp);
        const params = url.searchParams;

        const algorithm = algorithms.get(params.get("algorithm")?.toUpperCase() ?? "");
        const secret = params.get("secret") ?? "";

        if (!secret || !algorithm) {
            throw new Error("Invalid totp config: " + totp);
        }

        return {
            accountId: params.get("account_id") ?? "",
            algorithm,
            digits: Number.parseInt(params.get("digits") ?? "6"),
            issuer: params.get("issuer") ?? "",
            period: Number.parseInt(params.get("period") ?? "30"),
            secret,
            url: totp,
        };
    } catch (err) {
        if (strict) {
            throw new TotpParsingError(
                "Failed to parse TOTP URL",
                err instanceof Error ? err : new Error(err?.toString()),
            );
        }

        return null;
    }
}

/**
 * Use Time-based One-Time Password calculation with autorefreshing.
 */
export function useTotpCalculation(totp: MaybeRefOrGetter<TotpParsed | null | undefined>, offsetSeconds: number) {
    const result = ref<{ password: string; lifetimeSeconds: number }>();
    let expires = 0;
    let progress = false;

    const calcTotpLifetime = (exp: number) => Math.floor((exp - Date.now()) / 1000);

    const calcTotp = async (value: TotpParsed | null | undefined) => {
        if (!value) {
            expires = 0;
            result.value = undefined;
            refreshingInterval.pause();
            return;
        }

        progress = true;
        try {
            const res = await TOTP.generate(value.secret, {
                digits: value.digits,
                algorithm: value.algorithm,
                period: value.period,
                timestamp: Date.now() + offsetSeconds * 1000,
            });

            expires = res.expires;

            result.value = {
                password: res.otp,
                lifetimeSeconds: calcTotpLifetime(expires),
            };

            refreshingInterval.resume();
        } finally {
            progress = false;
        }
    };

    const refresh = () => {
        if (!result.value || progress) {
            return;
        }

        result.value.lifetimeSeconds = Math.floor((expires - Date.now()) / 1000);

        if (result.value.lifetimeSeconds <= 0) {
            void calcTotp(toValue(totp));
        }
    };

    const refreshingInterval = useIntervalFn(refresh, 1000);

    watch(() => toValue(totp), calcTotp, { immediate: true });

    return { otp: result };
}

const algorithms: Map<string, TOTPAlgorithm> = new Map([
    ["SHA1", "SHA-1"],
    ["SHA-1", "SHA-1"],
    ["SHA256", "SHA-256"],
    ["SHA-256", "SHA-256"],
    ["SHA384", "SHA-384"],
    ["SHA-384", "SHA-384"],
    ["SHA512", "SHA-512"],
    ["SHA-512", "SHA-512"],
]);
