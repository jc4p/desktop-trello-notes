import 'babel-polyfill'; // generators
import { h, render, Component } from 'preact';

import App from './src/note'

const renderApp = (Component) => {
  render(<Component />, document.getElementById('root'), document.getElementById('root').lastChild);
};

if (module.hot) {
  module.hot.accept('./src/note', function() {
    let newApp = require('./src/note').default;
    renderApp(newApp);
  });
}

renderApp(App);