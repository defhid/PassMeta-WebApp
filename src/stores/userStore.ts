import { reactive } from "vue";
import type { UserDto } from "@generated/api";

export interface IUserStore {
    get user(): Readonly<UserDto>;
    get isAuthenticated(): boolean;

    setUser(user: UserDto | null | undefined): void;
}

class UserStore implements IUserStore {
    private readonly state = reactive({
        user: {
            id: 0,
            login: "?",
            fullName: "Anonymous",
            isActive: false,
        },
    });

    get user() {
        return this.state.user;
    }

    get isAuthenticated() {
        return this.state.user?.id != null;
    }

    setUser(user: UserDto | null | undefined): void {
        this.state.user = {
            id: 0,
            login: "?",
            fullName: "Anonymous",
            isActive: false,
            ...user,
        };
    }
}

const instance = new UserStore();

export function useUserStore(): IUserStore {
    return instance;
}
