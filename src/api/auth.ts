import { RestProtocolFactory } from "./base/restProtocolFactory";
import { type SignInDto } from "@generated/api";

/**
 * Auth controllers.
 */
export const Auth = {
    /**
     * Sign in.
     */
    logIn: RestProtocolFactory.fromGenerated(
        (api, params: SignInDto) => api.auth.ctrlAuthSignInPost(params)),

    /**
     * Reset all current user sessions.
     */
    resetAll: RestProtocolFactory.fromGenerated(
        (api) => api.auth.ctrlAuthResetAllPost()),

    /**
     * Reset all current user sessions except this one.
     */
    resetAllExceptMe: RestProtocolFactory.fromGenerated(
        (api) => api.auth.ctrlAuthResetAllExceptMePost()),
};
