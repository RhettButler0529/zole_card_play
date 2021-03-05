import React from 'react';
import { StatusBar, Platform } from 'react-native';
import * as Font from 'expo-font';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Stack } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/es/integration/react';

import { Root, StyleProvider } from 'native-base';
import { I18nextProvider, translate } from 'react-i18next';
import getTheme from '../../native-base-theme/components';
import theme from '../../native-base-theme/variables/commonColor';

import configureStore from '../store/index';


import Routes from './routes/index';
import Loading from './components/UI/Loading';

// import i18n from './i18n';
import i18n2 from './i18n2';

const { persistor, store } = configureStore();

// Hide StatusBar on Android as it overlaps tabs
if (Platform.OS === 'android') StatusBar.setHidden(true);


function MakeQuerablePromise(promise) {
  // Don't modify any promise that has been already modified.
  if (promise.isFulfilled) return promise;

  // Set initial state
  let isPending = true;
  let isRejected = false;
  let isFulfilled = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  const result = promise.then(
    (v) => {
      console.log('is v');
      isFulfilled = true;
      isPending = false;
      return v;
    },
    (e) => {
      console.log('is e');
      isRejected = true;
      isPending = false;
      throw e;
    },
  );

  //  console.log(isPending);
  //  console.log(isFulfilled);
  //  console.log(isRejected);

  result.isFulfilled = function () { return isFulfilled; };
  result.isPending = function () { return isPending; };
  result.isRejected = function () { return isRejected; };
  return result;
}


export default class App extends React.Component {
  static propTypes = {
    store: PropTypes.shape({}).isRequired,
    persistor: PropTypes.shape({}).isRequired,
  }

  state = { loading: true }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require('./resources/fonts/Roboto-Regular.ttf'),
      Roboto_medium: require('./resources/fonts/Roboto-Medium.ttf'),
      Ionicons: require('./resources/fonts/ionicons.ttf'),
    //  Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    });

    i18n2.then((res) => {
      console.log(res);
      this.setState({ loading: false });
    });

    //  this.setState({ loading: false });

    //  this.setState({ loading: false });

    /* const myPromise = MakeQuerablePromise(i18n);

    console.log('Initial fulfilled:', myPromise.isFulfilled());// false
    console.log('Initial rejected:', myPromise.isRejected());// false
    console.log('Initial pending:', myPromise.isPending());// true

    myPromise.then((data) => {
      console.log(data); // "Yeah !"
      console.log('Final fulfilled:', myPromise.isFulfilled());// true
      console.log('Final rejected:', myPromise.isRejected());// false
      console.log('Final pending:', myPromise.isPending());// false

      this.setState({ init: true });
    });
    */
  }

  render() {
    const { loading } = this.state;

    if (loading) return <Loading />;

    //  if (!init) return <Loading />;

    return (
      <Root>
        <Provider store={store}>
          <PersistGate
            loading={<Loading />}
            persistor={persistor}
          >
            {/*  <I18nextProvider i18n={i18n2}>  */}
            <StyleProvider style={getTheme(theme)}>
              <Router>
                <Stack hideNavBar hideTabBar key="root">
                  {Routes}
                </Stack>
              </Router>
            </StyleProvider>
            {/*  </I18nextProvider> */}
          </PersistGate>
        </Provider>
      </Root>
    );
  }
}
