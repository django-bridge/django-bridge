import React, { ReactElement, FunctionComponent } from "react";
import { DirtyFormContext } from "../dirtyform";
import { Message } from "../fetch";

import { NavigationController } from "../navigation";
import {
    NavigateOptions,
    OpenModalOptions,
    ShellNavigationContext,
} from "../contexts";

export interface BrowserProps {
    views: Map<string, FunctionComponent>;
    navigationController: NavigationController;
    openModal(path: string, options?: OpenModalOptions): void;
    pushMessage(message: Message): void;
}

function Browser({
    views,
    navigationController,
    openModal,
    pushMessage,
}: BrowserProps): ReactElement {
    const {
        currentFrame,
        navigate,
        pushFrame,
        replacePath,
        submitForm,
        refreshContext,
    } = navigationController;

    if (currentFrame.serverMessages) {
        currentFrame.serverMessages.forEach(pushMessage);
        currentFrame.serverMessages = [];
    }

    const { isDirty, requestUnload, cancelUnload } =
        React.useContext(DirtyFormContext);

    const ShellNavigationUtils = React.useMemo(
        () => ({
            frameId: currentFrame.id,
            path: currentFrame.path,
            context: currentFrame.context,
            navigate: (url: string, options: NavigateOptions = {}) => {
                // If there is a dirty form, block navigation until unload has been confirmed
                if (!isDirty || options.skipDirtyFormCheck === true) {
                    if (options.skipDirtyFormCheck === true) {
                        cancelUnload();
                    }

                    return navigate(url, options.pushState);
                }

                return requestUnload().then(() =>
                    navigate(url, options.pushState)
                );
            },
            pushFrame,
            replacePath,
            submitForm,
            openModal,
            refreshContext,
            pushMessage,
        }),
        [
            currentFrame,
            pushFrame,
            replacePath,
            submitForm,
            openModal,
            isDirty,
            requestUnload,
            cancelUnload,
            navigate,
            refreshContext,
            pushMessage,
        ]
    );
    // Get the view component
    const View = views.get(currentFrame.view);
    if (!View) {
        return <p>Unknown view &apos;{currentFrame.view}&apos;</p>;
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return (
        <ShellNavigationContext.Provider value={ShellNavigationUtils}>
            <div key={currentFrame.id}>
                <View {...currentFrame.context} />
            </div>
        </ShellNavigationContext.Provider>
    );
}

export default Browser;
