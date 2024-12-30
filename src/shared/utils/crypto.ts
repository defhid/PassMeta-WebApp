import sha256 from "crypto-js/sha256";
import aes from "crypto-js/aes";
import utf8 from "crypto-js/enc-utf8";
import utf16 from "crypto-js/enc-utf16";
import arr from "crypto-js/lib-typedarrays";

export class PassMetaCrypto {
    /**
     * Number of encryption iterations.
     */
    private static readonly cryptoK = 100;

    /**
     * Encryption salt.
     */
    private static readonly cryptoSalt = utf8.parse("PassMetaFileSalt");

    /**
     * Make encryption/decryption key for specific iteration by keyphrase.
     */
    private static makeKey(iteration: number, keyPhrase: string)
    {
        const offset = (this.cryptoK + iteration) % keyPhrase.length;
        const key =
            keyPhrase.substring(0, offset) +
            Math.pow(this.cryptoK - iteration, iteration % 5) +
            keyPhrase.substring(offset);

        return sha256(utf16.parse(key));
    }

    /**
     * Encrypt data from decrypted bytes with key phrase.
     */
    public static encrypt(data: ArrayBuffer, keyPhrase: string)
    {
        let encryption = arr.create(data);

        for (let i = 0; i < this.cryptoK; ++i)
        {
            const key = this.makeKey(i, keyPhrase);
            const result = aes.encrypt(encryption, key, { iv: this.cryptoSalt });
            encryption = result.ciphertext;
        }

        return encryption;
    }
}
