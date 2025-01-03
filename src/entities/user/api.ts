import type { SignUpDto, UserDto, UserPatchDto } from "~generated/api";
import { RestProtocolFactory } from "~api";

/**
 * User controllers.
 */
export const UserApi = {
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
