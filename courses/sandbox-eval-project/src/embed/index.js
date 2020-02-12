// @flow
import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';

import requirePolyfills from '@codesandbox/common/lib/load-dynamic-polyfills';
import 'normalize.css';
import '@codesandbox/common/lib/global.css';
import track, { identify } from '@codesandbox/common/lib/utils/analytics';

import theme from './theme';
import App from './components/App';

try {
  identify('signed_in', Boolean(localStorage.jwt));
} catch (e) {
  /* ignore error */
}
document.addEventListener('click', () => {
  track('Embed Interaction');
});

requirePolyfills().then(() => {
  function renderApp(Component) {
    render(
      <ThemeProvider theme={theme}>
        <Component />
      </ThemeProvider>,
      document.getElementById('root')
    );
  }

  if (module.hot) {
    // $FlowIssue
    module.hot.accept('./components/App', () => {
      const NextApp = require('./components/App').default; // eslint-disable-line global-require
      renderApp(NextApp);
    });
  }

  renderApp(App);
});
