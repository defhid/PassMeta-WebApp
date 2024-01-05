import { RestProtocolFactory } from "@/api/base/restProtocolFactory";

/**
 * Auth controllers.
 */
export const Auth = {
    /**
     * Sign in.
     */
    LogIn: RestProtocolFactory.void("POST", () => "auth/sign-in"),

    /**
     * Reset all current user sessions.
     */
    PostResetAll: RestProtocolFactory.void("POST", () => "auth/reset/all"),

    /**
     * Reset all current user sessions except this one.
     */
    PostResetAllExceptMe: RestProtocolFactory.void("POST", () => "auth/reset/all-except-me"),
};
