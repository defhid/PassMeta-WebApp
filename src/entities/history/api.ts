import { RestProtocolFactory } from "~api/base/restProtocolFactory";
import type { CtrlHistoryPagesPageIndexGetParams, HistoryPageDto } from "~generated/api";

/**
 * History controllers.
 */
export const HistoryApi = {
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
