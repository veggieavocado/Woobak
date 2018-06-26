module.exports = function karmaConfig(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: ['tests/js/**/*.js'],
    reporters: ['progress'],
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome', 'ChromeHeadless', 'MyHeadlessChrome'],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,

    customLaunchers: {
      MyHeadlessChrome: {
        base: 'ChromeHeadless',
        flags: ['--disable-translate', 'disable-extensions', '--remote-debugging-port=9223'],
      },
    },
  });
};
