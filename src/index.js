import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import store from './store'
import { SnackbarProvider } from 'notistack';
import history from "./history";

import {
  Route,
  HashRouter as Router
} from "react-router-dom"
// const AppContainer = () => (
//   <Router history={history}>
//     <Provider store={store}>
//       <Route path="/" component={App} />
//     </Provider>
//   </Router>
// );

ReactDOM.render(
  <SnackbarProvider maxSnack={7}>
    {/* <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider> */}

    <Router history={history}>
      <Provider store={store}>
        <Route path="/" component={App} />
      </Provider>
    </Router>
  </SnackbarProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
