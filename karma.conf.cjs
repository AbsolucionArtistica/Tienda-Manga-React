module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'esm'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('@open-wc/karma-esm'),
    ],
    files: [
      { pattern: 'src/**/*.js', included: false },
      { pattern: 'src/**/*.jsx', included: false },
      { pattern: 'test/karma/**/*.spec.js', type: 'module' },
    ],
    esm: {
      moduleDirs: ['node_modules'],
      browserNoCompat: true,
    },
    reporters: ['progress'],
    browsers: ['Chrome'],
    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO,
  });
};
