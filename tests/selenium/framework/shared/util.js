let EC = protractor.ExpectedConditions;
let util = module.exports = {};

util.wait = function (elementFinder) {
  return browser.wait(EC.presenceOf(elementFinder));
};

util.waitTillClickable = function (elementFinder) {
  return browser.wait(EC.elementToBeClickable(elementFinder));
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
      console.log("********* dim.width = " + dim.width);
      console.log("********* pos.x = " + pos.x);

      console.log("********* dim.height = " + dim.height);
      console.log("********* pos.y = " + pos.y);

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