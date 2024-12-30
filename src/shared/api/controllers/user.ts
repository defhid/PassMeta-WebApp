import { RestProtocolFactory } from "../base/restProtocolFactory";
import type { SignUpDto, UserDto, UserPatchDto } from "~generated/api";

/**
 * User controllers.
 */
export const User = {
    /**
     * Create a new user.
     */
    post: RestProtocolFactory.fromGenerated<SignUpDto, UserDto>((api, params) => api.users.ctrlUsersNewPost(params)),

    /**
     * Get current user.
     */
    getMe: RestProtocolFactory.fromGenerated((api) => api.users.ctrlUsersMeGet()),

    /**
     * Edit current user.
     */
    patchMe: RestProtocolFactory.fromGenerated<UserPatchDto, UserDto>((api, params) =>
        api.users.ctrlUsersMePatch(params),
    ),
};
