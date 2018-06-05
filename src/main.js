import React from 'react';
import { render } from 'react-dom';
import App from './App.jsx';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import appState from './redux/reducers';
import { Provider } from 'react-redux';

const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

const store = createStore(
  appState,
  compose(
    applyMiddleware(logger, thunkMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
