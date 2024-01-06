const { generateApi } = require("swagger-typescript-api");
const path = require("path");

const config = require("dotenv").config({ path: "../.env" });

generateApi({
    name: "api.ts",
    output: path.resolve(process.cwd(), "../src/.generated"),
    url: config.parsed.VITE_PASSMETA_API + "/openapi.json",
    generateClient: true,
    httpClientType: "fetch",
    extractRequestParams: true,
    primitiveTypeConstructs: (constructs) => ({
        ...constructs,
        string: {
            "date-time": "Date",
        },
    }),
}).catch((e) => console.error(e));
