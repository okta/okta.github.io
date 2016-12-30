const jasmineReporters = require('jasmine-reporters');

exports.config = {
  framework: 'jasmine2',
  onPrepare() {
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      savePath: 'build2/reports/junit',
      filePrefix: 'results',
    }));
  },
  specs: ['spec/*.js']
};
