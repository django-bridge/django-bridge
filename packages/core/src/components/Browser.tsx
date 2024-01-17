import React, { ReactElement, FunctionComponent } from "react";
import { DirtyFormContext } from "../dirtyform";
import { Message } from "../fetch";

import { NavigationController } from "../navigation";
import {
  NavigateOptions,
  OpenModalOptions,
  NavigationContext,
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
      openModal,
      refreshProps: refreshProps,
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
