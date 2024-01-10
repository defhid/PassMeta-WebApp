import { readonly } from "vue";
import { Auth } from "./auth";
import { Passfile } from "./passfile";
import { General } from "./general";
import { User } from "./user";
import { History } from "./history";

export const PassMetaApi = readonly({
    auth: Auth,
    general: General,
    history: History,
    passfile: Passfile,
    user: User,
});
