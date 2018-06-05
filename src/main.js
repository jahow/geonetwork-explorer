import React from 'react';
import { render } from 'react-dom';
import App from './App.jsx';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import appState from './redux/reducers';
import { Provider } from 'react-redux';

const store = createStore(
  appState,
  compose(
    applyMiddleware(thunkMiddleware),
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
