import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

// import { perfMiddleware } from '../../utils/performance';
import Explorer from './Explorer';
import explorer from './reducers/explorer';
import nodes from './reducers/nodes';
import { openExplorer, closeExplorer } from './actions';

/**
 * Initialises the explorer component on the given nodes.
 */
const initExplorer = (explorerNode: HTMLElement) => {
    const rootReducer = combineReducers({
        explorer,
        nodes,
    });

    const middleware = [
        thunkMiddleware,
    ];

    // Uncomment this to use performance measurements.
    // if (process.env.NODE_ENV !== 'production') {
    //     middleware.push(perfMiddleware);
    // }

    const store = createStore(rootReducer, {}, compose(
        applyMiddleware(...middleware),
        // Expose store to Redux DevTools extension.
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (func: any) => func
    ));

    ReactDOM.render((
        <Provider store={store}>
            <Explorer />
        </Provider>
    ), explorerNode);

    return {
        open(startPage: number) {
            (store.dispatch as any)(openExplorer(startPage));
        },
        close() {
            (store.dispatch as any)(closeExplorer());
        }
    };
};

export default Explorer;

export {
    initExplorer,
};
