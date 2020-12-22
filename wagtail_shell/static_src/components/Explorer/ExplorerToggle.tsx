/* eslint-disable react/prop-types */

import React from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';

import Button from '../common/Button';
import Icon from '../common/Icon';

interface ExplorerToggleProps {
  onToggle(): void;
  children: React.ReactNode;
}

/**
 * A Button which toggles the explorer.
 */
const ExplorerToggle: React.FunctionComponent<ExplorerToggleProps> = ({ children, onToggle }) => (
  <Button
    dialogTrigger={true}
    onClick={onToggle}
  >
    <Icon name="folder-open-inverse" className="icon--menuitem" />
    {children}
    <Icon name="arrow-right" className="icon--submenu-trigger" />
  </Button>
);

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) => ({
  onToggle: (page: number) => dispatch(actions.toggleExplorer(page)),
});

const mergeProps = (_stateProps: any, dispatchProps: ExplorerToggleProps, ownProps: any) => ({
  children: ownProps.children,
  onToggle: dispatchProps.onToggle.bind(null, ownProps.startPage),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ExplorerToggle);
