import React, { ReactElement, ReactNode } from "react";
import { DirtyFormContext } from "../dirtyform";

import { NavigationController } from "../navigation";
import {
  NavigateOptions,
  OpenOverlayOptions,
  NavigationContext,
  MessagesContext,
} from "../contexts";
import Config from "../config";

export interface BrowserProps {
  config: Config;
  navigationController: NavigationController;
  openOverlay(
    path: string,
    render: (content: ReactNode) => ReactNode,
    options?: OpenOverlayOptions
  ): void;
}

function Browser({
  config,
  navigationController,
  openOverlay,
}: BrowserProps): ReactElement {
  const {
    currentFrame,
    navigate,
    pushFrame,
    replacePath,
    submitForm,
    refreshProps,
  } = navigationController;

  // Push any messages from the server
  const { pushMessage } = React.useContext(MessagesContext);
  if (currentFrame.serverMessages) {
    currentFrame.serverMessages.forEach(pushMessage);
    currentFrame.serverMessages = [];
  }

  const { isDirty, requestUnload, cancelUnload } =
    React.useContext(DirtyFormContext);

  const NavigationUtils = React.useMemo(
    () => ({
      frameId: currentFrame.id,
      path: currentFrame.path,
      props: currentFrame.props,
      context: currentFrame.context,
      navigate: (url: string, options: NavigateOptions = {}) => {
        // If there is a dirty form, block navigation until unload has been confirmed
        if (!isDirty || options.skipDirtyFormCheck === true) {
          if (options.skipDirtyFormCheck === true) {
            cancelUnload();
          }

          return navigate(url, options.pushState);
        }

        return requestUnload().then(() => navigate(url, options.pushState));
      },
      pushFrame,
      replacePath,
      submitForm,
      openOverlay,
      refreshProps,
    }),
    [
      currentFrame,
      pushFrame,
      replacePath,
      submitForm,
      openOverlay,
      isDirty,
      requestUnload,
      cancelUnload,
      navigate,
      refreshProps,
    ]
  );
  // Get the view component
  const View = config.views.get(currentFrame.view);
  if (!View) {
    return <p>Unknown view &apos;{currentFrame.view}&apos;</p>;
  }

  // Render the view and wrap it with each configured global context provider
  let view = <View {...currentFrame.props} />;
  config.contextProviders.forEach((provider, name) => {
    view = (
      <provider.Provider value={currentFrame.context[name]}>
        {view}
      </provider.Provider>
    );
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <NavigationContext.Provider value={NavigationUtils}>
      <div key={currentFrame.id}>{view}</div>
    </NavigationContext.Provider>
  );
}

export default Browser;
