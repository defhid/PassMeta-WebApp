import { reactive } from "vue";
import type { UserDto } from "@generated/api";

export interface IUserStore {
    get user(): Readonly<UserDto> | null;
    get isAuthenticated(): boolean;

    setUser(user: UserDto | null): void;
}

class UserStore implements IUserStore {
    private readonly state = reactive({
        user: null as UserDto | null,
    });

    get user() {
        return this.state.user;
    }

    get isAuthenticated() {
        return this.state.user?.id != null;
    }

    setUser(user: UserDto | null): void {
        this.state.user = { ...user } as UserDto;
    }
}

const instance = new UserStore();

export function useUserStore(): IUserStore {
    return instance;
}
