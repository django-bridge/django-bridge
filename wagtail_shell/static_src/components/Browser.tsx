import React from 'react';

import { NavigationController } from "../navigation";
import { FrameWrapper } from './Frame';

export interface BrowserProps {
    navigationController: NavigationController;
    openModal(url: string): void;
}

export const Browser: React.FunctionComponent<BrowserProps> = ({navigationController, openModal}) => {
    const {currentFrame, nextFrame, navigate} = navigationController;

    const onLoadNextFrame = (title: string) => {
        navigationController.onLoadNextFrame(title);
    };

    let style: React.CSSProperties = {};
    let frameStyle: React.CSSProperties = {};

    if (navigationController.mode == 'browser') {
        style = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        };

        frameStyle = {
            overflow: 'auto',
            border: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        };
    } else {
        frameStyle = {
            border: 0,
            width: '100%',
            height: '1000px',
        };
    }


    let frames: React.ReactNode[] = [];
    frames.push(
        <div key={currentFrame.id} style={style}>
            <FrameWrapper
                mode={navigationController.mode}
                visible={true}
                frame={currentFrame}
                style={frameStyle}
                navigate={navigate}
                openModal={openModal}
            />
        </div>
    );

    if (nextFrame) {
        frames.push(
            <div key={nextFrame.id}>
                <FrameWrapper
                    mode={navigationController.mode}
                    visible={false}
                    frame={nextFrame}
                    navigate={navigate}
                    openModal={openModal}
                    onLoad={onLoadNextFrame}
                />
            </div>
        );
    }

    return <>{frames}</>;
};
