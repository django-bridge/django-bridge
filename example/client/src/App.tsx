import React, { ReactElement } from "react";
import "./App.css";

import Shell from "./shell";
import { ShellResponse } from "./shell/fetch";
import LoadingView from "./shell/views/Loading";
import UserProfileView from "./users/views/Profile";
import { ShellGlobals } from "./shell/contexts";

const views = new Map();
views.set("loading", LoadingView);
views.set("user-profile", UserProfileView);

function App(): ReactElement {
    const rootElement = document.getElementById("root");
    const initialResponse = rootElement?.dataset.initialResponse;
    const globals = rootElement?.dataset.globals;

    if (initialResponse && globals) {
        return (
            <Shell
                views={views}
                initialResponse={JSON.parse(initialResponse) as ShellResponse}
                globals={JSON.parse(globals) as ShellGlobals}
            />
        );
    }
    return <>Unable to render</>;
}

export default App;
