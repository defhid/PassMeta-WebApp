/**
 * PassMeta random generation methods.
 */
export class PassMetaRandom {
    private static readonly failureGenerationResult = ":(";

    /**
     * Generate random password by length, using digits and special symbols.
     */
    static generatePassword(
        length: number,
        digits: boolean,
        lowercase: boolean,
        uppercase: boolean,
        special: boolean,
    ): string {
        const userFriendlyLowercaseSet = "abcdefghijkmnopqrstuvwxyz";
        const userFriendlyUppercaseSet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const userFriendlySet = userFriendlyLowercaseSet + userFriendlyUppercaseSet;
        const digitSet = "0123456789";
        const specialSet = "*-_!@";

        const builder: string[] = [];
        const letters = lowercase || uppercase;

        if (!digits && !letters && !special) {
            return this.failureGenerationResult;
        }

        try {
            lowercase && builder.push(...Array.from(Array(2)).map(() => userFriendlyLowercaseSet));

            uppercase && builder.push(...Array.from(Array(2)).map(() => userFriendlyUppercaseSet));

            if (digits) {
                const k = Math.max((lowercase ? 1 : 0) + (uppercase ? 1 : 0), 1);
                builder.push(...Array.from(Array(k)).map(() => digitSet));
            }

            if (special) {
                const k = Math.max((lowercase ? 1 : 0) + (uppercase ? 1 : 0) + (digits ? 1 : 0), 1);
                builder.push(...Array.from(Array(k)).map(() => specialSet));
            }

            const chars = builder.sort(() => (Math.random() > 0.5 ? 1 : -1)).join("");
            let prev: string | null = null;

            const result: string[] = [];
            while (result.length < length) {
                const curr = chars[Math.round(Math.random() * chars.length)];

                if (letters && prev == null && !userFriendlySet.includes(curr)) {
                    continue;
                }

                if ((letters || digits) && prev != null) {
                    if (specialSet.includes(prev) && specialSet.includes(curr)) {
                        continue;
                    }
                }

                result.push(curr);
                prev = curr;
            }

            return result.join("");
        } catch (err) {
            console.error("Password generation failed", err);
            return this.failureGenerationResult;
        }
    }
}
