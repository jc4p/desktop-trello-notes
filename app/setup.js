import 'babel-polyfill'; // generators
import React from 'react';
import { render as renderReact } from 'react-dom';

const srcPath = './src/setup';

let App = require(srcPath).default;

const render = (Component) => {
  renderReact(<Component />, document.getElementById('root'));
};

if (module.hot) {
  module.hot.accept(srcPath, function() {
    let newApp = require(srcPath).default;
    render(newApp);
  });
}

render(App);