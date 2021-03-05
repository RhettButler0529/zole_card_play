/* global document */
import 'core-js/es/set';
import 'core-js/es/map';
import 'core-js/features/set';
import 'babel-polyfill';

import 'moment/locale/lv';
import 'moment/locale/ru';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';

import ReactGA from 'react-ga';

import configureStore from '../store/index';
import * as serviceWorker from './register-service-worker';
import Routes from './routes/index';

// Components
import Loading from './components/UI/Loading';


import i18n from './i18n';

// Load css
import './styles/style.scss';

/* ReactGA.initialize('UA-147571548-1', {
  debug: false,
  gaOptions: {
    storage: 'none',
    storeGac: false,
  }
});
ReactGA.pageview('/'); */


const { persistor, store } = configureStore();

// i18n.then(() => {
const Root = () => (
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <Router>
        <Routes />
      </Router>
    </PersistGate>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
// });
