import { type Config } from "tailwindcss";
import PrimeUI from "tailwindcss-primeui";

export default {
    content: ["./index.html", "./src/**/*.{vue,css}"],
    theme: {
        extend: {},
    },
    plugins: [PrimeUI],
} as Config;
