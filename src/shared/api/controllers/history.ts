import { RestProtocolFactory } from "../base/restProtocolFactory";
import type { CtrlHistoryPagesPageIndexGetParams, HistoryPageDto } from "~generated/api";

/**
 * General controllers.
 */
export const History = {
    /**
     * Get history kinds.
     */
    getInfo: RestProtocolFactory.fromGenerated((api) => api.history.ctrlHistoryKindsGet()),

    /**
     * Get paged history.
     */
    check: RestProtocolFactory.fromGenerated<CtrlHistoryPagesPageIndexGetParams, HistoryPageDto>((api, params) =>
        api.history.ctrlHistoryPagesPageIndexGet(params),
    ),
};
