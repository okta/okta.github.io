var EC = protractor.ExpectedConditions;
var util = module.exports = {};

util.wait = function (elementFinder, timeoutMilliseconds) {
  if (timeoutMilliseconds === undefined) {
    //use default timeout
    return browser.wait(EC.presenceOf(elementFinder));
  } else {
    return browser.wait(EC.presenceOf(elementFinder), timeoutMilliseconds);
  }
};

util.isOnScreen = function (elementFinder) {
  return () => {
    const location = elementFinder.getLocation();
    const size = elementFinder.getSize();
    return Promise.all([location, size]).then((args) => {
      const pos = args[0];
      const dim = args[1];
      return dim.width + pos.x > 0 && dim.height + pos.y > 0;
    });
  };
};

util.itNoHeadless = function(desc, fn) {
  if (process.env.CHROME_HEADLESS) {
    xit(desc, fn);
  } else {
    it(desc, fn);
  }
};

util.EC = EC;

util.itHelper = function(fn) {
    return done => {
        fn.call().then(done, err => {
            done(err);
        });
    }
};
