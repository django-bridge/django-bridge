import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import FocusTrap from 'react-focus-trap';

// @ts-ignore
import ExpandIcon from '../icons/expand-solid.svg';

// import _ from 'lodash';

const ExpandButton = styled.button`
    width: 2.2rem;
    height: 2.2rem;
    position: absolute;
    top: 10px;
    right: 50px;
    padding: 0;
    padding-top: 0.25em;

    svg {
        height: 1.4em;
    }
`;

interface ModalHeaderProps {
    heading: string;
    headingId?: string;
    onClose(): void;
    onExpand?(): void;
}

const ModalHeader: React.FunctionComponent<ModalHeaderProps> = ({ heading, headingId, onClose, onExpand }) => (
  <header className="nice-padding" style={{marginBottom: '0', padding: '0', height: '3.3rem'}}>
    <div className="row">
      <div className="left">
        <div className="col">
          <h1 className="visuallyhidden" id={headingId}>
            {heading}
          </h1>
        </div>
      </div>
      <div className="right">
        {onExpand && <ExpandButton
                onClick={onExpand}
                type="button"
                className="button"
                data-dismiss="modal"
            >
                <ExpandIcon />
            </ExpandButton>}
        <button
                onClick={onClose}
                type="button"
                className="button close icon text-replace icon-cross"
                data-dismiss="modal"
            >
                &times;
            </button>
        </div>
    </div>
  </header>
);

interface ModalSpinnerProps {
    isActive?: boolean;
}

const ModalSpinner: React.FunctionComponent<ModalSpinnerProps> = ({ isActive=false, children }) =>
  <div className={`loading-mask${isActive ? ' loading' : ''}`}>
    {children}
  </div>;

interface ModalWindowProps {
    heading: string;
    isLoading?: boolean;
    onClose(): void;
    onExpand?(): void;
    onKeyDown?(e: KeyboardEvent): void;
}

const ModalWindow: React.FunctionComponent<ModalWindowProps> = (props) => {
    const id = useRef<string | null>(null);
    if (!id.current) {
        id.current = 'hi'; //_.uniqueId('react-modal-');
    }

    // const previousFocusedElement = useRef<HTMLElement | null>(null);

    const onClose = () => {
        // Refocus the element that was focused when the modal was opened
        // TODO: do this in the iframe itself
        // previousFocusedElement.current.focus();

        props.onClose();
    };

    // Control modal visibility
    // The modal shouldn't become visible until it's either loaded or has been loading
    // for some time
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        if (!modalVisible && !props.isLoading) {
            // Content finished loading
            setModalVisible(true);
        }
    }, [props.isLoading]);
    useEffect(() => {
        // If the content is taking a long time to load, show the modal
        // anyway.
        const timeout = setTimeout(() => {
            setModalVisible(true);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    });

    // Control loading spinner
    // Only show it if loading is taking a while, so it doesn't flash as you type
    const [loadingSpinnerVisible, setLoadingSpinnerVisible] = useState(false);
    useEffect(() => {
        setLoadingSpinnerVisible(false);

        // Creating timeout every time (even if it isn't loading) seems to be much more reliable
        const timeout = setTimeout(() => {
            if (props.isLoading) {
                setLoadingSpinnerVisible(true);
            }
        }, 100);

        return () => {
            clearTimeout(timeout);
        };
    }, [props.isLoading]);

    const modalStyle = {
        display: modalVisible ? 'block' : 'none',
    };
    const modalClasses = ['modal', 'fade'];

    const overlayStyle: React.CSSProperties = {};
    const overlayClasses = ['modal-backdrop', 'fade'];

    if (modalVisible) {
        modalClasses.push('in');
        overlayClasses.push('in');
    } else {
        overlayStyle.cursor = 'wait';
    }

    return (
        <div>
            <div
                className={modalClasses.join(' ')}
                tabIndex={-1}
                role="dialog"
                aria-modal={true}
                aria-hidden={!modalVisible}
                style={modalStyle}
                aria-labelledby={`${id.current}-title`}
            >
                <FocusTrap>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{paddingBottom: '0'}}>
                            <ModalHeader heading={props.heading} headingId={`${id.current}-title`} onClose={onClose} onExpand={props.onExpand} />
                            <div className="modal-body">
                                <ModalSpinner isActive={props.isLoading && loadingSpinnerVisible}>
                                    {props.children}
                                </ModalSpinner>
                            </div>
                        </div>
                    </div>
                </FocusTrap>
            </div>
            <div className={overlayClasses.join(' ')} style={overlayStyle} />
        </div>
    );
}

export default ModalWindow;
