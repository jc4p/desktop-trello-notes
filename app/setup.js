import 'babel-polyfill'; // generators
import { h, render, Component } from 'preact';

import App from './src/setup';

const renderApp = (Component) => {
  render(<Component />, document.getElementById('root'), document.getElementById('root').lastChild);
};

if (module.hot) {
  module.hot.accept('./src/setup', function() {
    let newApp = require('./src/setup').default;
    renderApp(newApp);
  });
}

renderApp(App);