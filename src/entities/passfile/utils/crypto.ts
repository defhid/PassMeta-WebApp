/**
 * PassMeta cryptographic methods for passfiles.
 */
export class PassMetaCrypto {
    /**
     * Number of encryption iterations.
     */
    private static readonly cryptoK = 100;

    /**
     * Encryption salt.
     */
    private static readonly cryptoSalt = new TextEncoder().encode("PassMetaFileSalt");

    /**
     * Encrypt data from decrypted bytes with key phrase.
     */
    public static async encrypt(data: ArrayBuffer, keyPhrase: string): Promise<ArrayBuffer> {
        const algorithm: AesCbcParams = { name: "AES-CBC", iv: this.cryptoSalt };
        let encryption = data;

        for (let i = 0; i < this.cryptoK; ++i) {
            const key = await this.makeKey(i, keyPhrase);
            encryption = await window.crypto.subtle.encrypt(algorithm, key, encryption);
        }

        return encryption;
    }

    /**
     * Decrypt data from encrypted bytes with key phrase.
     */
    public static async decrypt(data: ArrayBuffer, keyPhrase: string): Promise<ArrayBuffer> {
        const algorithm: AesCbcParams = { name: "AES-CBC", iv: this.cryptoSalt };
        let decryption = data;

        for (let i = this.cryptoK - 1; i >= 0; --i) {
            const key = await this.makeKey(i, keyPhrase);
            decryption = await window.crypto.subtle.decrypt(algorithm, key, decryption);
        }

        return decryption;
    }

    /**
     * Make encryption/decryption key for specific iteration by keyphrase.
     */
    private static async makeKey(iteration: number, keyPhrase: string): Promise<CryptoKey> {
        const offset = (this.cryptoK + iteration) % keyPhrase.length;
        const key =
            keyPhrase.substring(0, offset) +
            Math.pow(this.cryptoK - iteration, iteration % 5) +
            keyPhrase.substring(offset);

        const hashed = await window.crypto.subtle.digest({ name: "SHA-256" }, new TextEncoder().encode(key));

        return await window.crypto.subtle.importKey("raw", hashed, "AES-CBC", false, ["encrypt", "decrypt"]);
    }
}
