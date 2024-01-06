import { readonly } from "vue";
import { Auth } from "./auth";
import { Passfile } from "./passfile";
import { General } from "@api/general";
import { User } from "@api/user";
import { History } from "@api/history";

export const PassMetaApi = readonly({
    auth: Auth,
    general: General,
    history: History,
    passfile: Passfile,
    user: User,
});
