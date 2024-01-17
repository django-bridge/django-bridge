import React, { ReactElement, FunctionComponent, ReactNode } from "react";
import { DirtyFormContext } from "../dirtyform";
import { Message } from "../fetch";

import { NavigationController } from "../navigation";
import {
  NavigateOptions,
  OpenOverlayOptions,
  NavigationContext,
} from "../contexts";

export interface BrowserProps {
  views: Map<string, FunctionComponent>;
  navigationController: NavigationController;
  openOverlay(path: string, render: (content: ReactNode, onClose: () => void, requestClose: boolean) => ReactNode, options?: OpenOverlayOptions): void;
  pushMessage(message: Message): void;
}

function Browser({
  views,
  navigationController,
  openOverlay,
  pushMessage,
}: BrowserProps): ReactElement {
  const {
    currentFrame,
    navigate,
    pushFrame,
    replacePath,
    submitForm,
    refreshProps,
  } = navigationController;

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
      refreshProps: refreshProps,
      pushMessage,
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
    <NavigationContext.Provider value={NavigationUtils}>
      <div key={currentFrame.id}>
        <View {...currentFrame.props} />
      </div>
    </NavigationContext.Provider>
  );
}

export default Browser;
