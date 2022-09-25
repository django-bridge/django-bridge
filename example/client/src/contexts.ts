import React from "react";

import { User } from "./users/types";
import { createTestUser } from "./users/testdata";

export interface Globals {
    user: User | null;
    urls: {
        userProfile: string;
        logout: string;
    };
}

export const GlobalsContext = React.createContext<Globals>({
    user: createTestUser(),
    urls: {
        userProfile: "#",
        logout: "#",
    },
});
