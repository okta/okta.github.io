var EC = protractor.ExpectedConditions;
var util = module.exports = {};

util.wait = function (elementFinder) {
  return browser.wait(EC.presenceOf(elementFinder));
};

util.formatUrl = function (url, hideNav) {
  return url + (hideNav ? '?hideNav=true' : '');
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
}

util.itNoPhantom = function(desc, fn) {
  if (process.env.PHANTOMJS) {
    xit(desc, fn);
  } else {
    it(desc, fn);
  };
}

util.EC = EC;