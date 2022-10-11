import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import persistedReducer from './_reduces/index';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import ScrollToTop from './ScrollToTop';

document.cookie = 'safeCookie1=foo; SameSite=Lax';
document.cookie = 'safeCookie2=foo';
document.cookie = 'crossCookie=bar; SameSite=None; Secure';

const store = createStore(
  persistedReducer,
  compose(
    applyMiddleware(promiseMiddleware, ReduxThunk)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

const persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);