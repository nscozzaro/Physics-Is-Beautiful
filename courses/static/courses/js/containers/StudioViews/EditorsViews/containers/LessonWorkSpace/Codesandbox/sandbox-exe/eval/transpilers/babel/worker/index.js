import loadPolyfills from '../../../../../common/load-dynamic-polyfills'

// require('app/config/polyfills')

// TODO fix?
self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs5/browserfs.min.js`
)

self.process = self.BrowserFS.BFSRequire('process')
self.Buffer = self.BrowserFS.BFSRequire('buffer').Buffer

loadPolyfills().then(() => {
  // eslint-disable-next-line global-require
  require('./babel-worker')
})
