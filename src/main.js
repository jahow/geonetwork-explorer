import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { createStore } from 'redux';
import appState from './redux/reducers';

const store = createStore(appState);
render(<App />, document.getElementById('root'));
