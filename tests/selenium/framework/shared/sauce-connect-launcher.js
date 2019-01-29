var sauceConnectLauncher = module.exports = {};

if (process.env.SAUCE_CONNECT_DOWNLOAD_ON_INSTALL) {
  sauceConnectLauncher.launcher = require('sauce-connect-launcher'),
    options = {

      // Sauce Labs username.  You can also pass this through the
      // SAUCE_USERNAME environment variable
      username: 'bermi',

      // Sauce Labs access key.  You can also pass this through the
      // SAUCE_ACCESS_KEY environment variable
      accessKey: '12345678-1234-1234-1234-1234567890ab',

      // Log output from the `sc` process to stdout?
      verbose: false,

      // Enable verbose debugging (optional)
      verboseDebugging: false,

      // Together with verbose debugging will output HTTP headers as well (optional)
      vv: false,

      // Port on which Sauce Connect's Selenium relay will listen for
      // requests. Default 4445. (optional)
      port: null,

      // Proxy host and port that Sauce Connect should use to connect to
      // the Sauce Labs cloud. e.g. "localhost:1234" (optional)
      proxy: null,

      // Change sauce connect logfile location (optional)
      logfile: null,

      // Period to log statistics about HTTP traffic in seconds (optional)
      logStats: null,

      // Maximum size before which the logfile is rotated (optional)
      maxLogsize: null,

      // Set to true to perform checks to detect possible misconfiguration or problems (optional)
      doctor: null,

      // Identity the tunnel for concurrent tunnels (optional)
      tunnelIdentifier: null,

      // an array or comma-separated list of regexes whose matches
      // will not go through the tunnel. (optional)
      fastFailRegexps: null,

      // an array or comma-separated list of domains that will not go
      // through the tunnel. (optional)
      directDomains: null,

      // A function to optionally write sauce-connect-launcher log messages.
      // e.g. `console.log`.  (optional)
      logger: function (message) {
      },

      // an optional suffix to be appended to the `readyFile` name.
      // useful when running multiple tunnels on the same machine,
      // such as in a continuous integration environment. (optional)
      readyFileId: null,

      // retry to establish a tunnel multiple times. (optional)
      connectRetries: 0,

      // time to wait between connection retries in ms. (optional)
      connectRetryTimeout: 2000,

      // retry to download the sauce connect archive multiple times. (optional)
      downloadRetries: 0,

      // time to wait between download retries in ms. (optional)
      downloadRetryTimeout: 1000,

      // path to a sauce connect executable (optional)
      // by default the latest sauce connect version is downloaded
      exe: null,

      // keep sc running after the node process exited, this means you need to close
      // the process manually once you are done using the pidfile
      // Attention: This only works with sc versions <= 4.3.16 and only on macOS and
      // linux at the moment
      detached: null,

      // specify a connect version instead of fetching the latest version, this currently
      // does not support checksum verification
      connectVersion: 'latest'
    };

  launcher(options, function (err, sauceConnectProcess) {
    console.log("Started Sauce Connect Process");
    sauceConnectProcess.close(function () {
      console.log("Closed Sauce Connect process");
    });
  });
}