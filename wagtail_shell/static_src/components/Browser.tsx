import React from 'react';

import { NavigationController } from "../navigation";
import { ContentWrapper } from './ContentWrapper';

export interface BrowserProps {
    navigationController: NavigationController;
}

export const Browser: React.FunctionComponent<BrowserProps> = ({navigationController}) => {
    const {currentFrame, nextFrame, navigate} = navigationController;

    const onLoadNextFrame = (title: string) => {
        navigationController.onLoadNextFrame();
        document.title = title;
    };

    let frames: React.ReactNode[] = [];
    frames.push(
        <div style={{
            overflow: 'scroll',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        }}>
            <ContentWrapper
                key={currentFrame.id}
                visible={true}
                frame={currentFrame}
                navigate={navigate}
            />
        </div>
    );

    if (nextFrame) {
        frames.push(
            <ContentWrapper
                key={nextFrame.id}
                visible={false}
                frame={nextFrame}
                navigate={navigate}
                onLoad={onLoadNextFrame}
            />
        );
    }

    return <>{frames}</>;
};
