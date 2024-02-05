import { readonly } from "vue";
import { Auth } from "./controllers/auth";
import { Passfile } from "./controllers/passfile";
import { General } from "./controllers/general";
import { User } from "./controllers/user";
import { History } from "./controllers/history";

export const PassMetaApi = readonly({
    auth: Auth,
    general: General,
    history: History,
    passfile: Passfile,
    user: User,
});
