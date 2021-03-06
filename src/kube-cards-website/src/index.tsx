import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import './index.css';
import KubeCardsApp from './KubeCardsApp';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';

import store from './KubeCardsStore';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <KubeCardsApp />
        </Router>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
