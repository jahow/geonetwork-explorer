import React from 'react';
import { render } from 'react-dom';
import App from './App.jsx';
import { createStore } from 'redux';
import appState from './redux/reducers';

const store = createStore(appState);
render(React.createElement(App), document.getElementById('root'));
