import React, { ReactElement } from "react";
import Shell, { ShellResponse } from "djream";

import LoginView from "./auth/views/Login";
import UserProfileView from "./users/views/Profile";

import { Globals, GlobalsContext } from "./contexts";

import "./App.css";
import "./telepath";

const views = new Map();
views.set("auth-login", LoginView);
views.set("user-profile", UserProfileView);

function App(): ReactElement {
    const rootElement = document.getElementById("root");
    const initialResponse = rootElement?.dataset.initialResponse;
    const globals = rootElement?.dataset.globals;

    if (initialResponse && globals) {
        return (
            <GlobalsContext.Provider value={JSON.parse(globals) as Globals}>
                <Shell
                    views={views}
                    initialResponse={
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        JSON.parse(initialResponse) as ShellResponse
                    }
                />
            </GlobalsContext.Provider>
        );
    }
    return <>Unable to render</>;
}

export default App;
