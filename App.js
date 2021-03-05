import React from 'react';
import Root from './src/native/index';
import configureStore from './src/store/index';

const { persistor, store } = configureStore();

export default function App() {
  return <Root store={store} persistor={persistor} />;
}

import { polyfillLoader } from 'polyfill-io-feature-detection';
// This function load polyfills only if needed. By default it uses polyfill.io
polyfillLoader({
  "features": "Promise,fetch",
  "onCompleted": App
});
