import { RestProtocolFactory } from "../base/restProtocolFactory";

/**
 * General controllers.
 */
export const General = {
    /**
     * Get current session and server information.
     */
    getInfo: RestProtocolFactory.fromGenerated((api) => api.info.ctrlInfoGet()),

    /**
     * Get OK response.
     */
    check: RestProtocolFactory.fromGenerated((api) => api.check.ctrlCheckGet()),
};
