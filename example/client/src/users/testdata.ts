import { User } from "./types";

// eslint-disable-next-line import/prefer-default-export
export function createTestUser(overrides: Partial<User> = {}): User {
    return {
        firstName: "Bender",
        lastName: "Rodríguez",
        fullName: "Bender Rodríguez",
        shortName: "Bender",
        displayName: "Bender Rodríguez",
        avatarUrl:
            "https://gravatar.com/avatar/31c3d5cc27d1faa321c2413589e8a53f?s=200&d=robohash&r=x",
        ...overrides,
    };
}
