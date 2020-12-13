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
        <div key={currentFrame.id} style={{
            overflow: 'scroll',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        }}>
            <ContentWrapper
                visible={true}
                frame={currentFrame}
                navigate={navigate}
            />
        </div>
    );

    if (nextFrame) {
        frames.push(
            <div key={nextFrame.id}>
                <ContentWrapper
                    visible={false}
                    frame={nextFrame}
                    navigate={navigate}
                    onLoad={onLoadNextFrame}
                />
            </div>
        );
    }

    return <>{frames}</>;
};
