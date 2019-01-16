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

util.customMatchers = {
  toContainAllElements: function(util, customEqualityTesters) {
    return {
      compare: function(haystackArray, needleArray) {
        var missingHaystack = false;
        var haystackStatus = 'present';
        var missingNeedles = false;
        var needlesStatus = 'present';
        if (haystackArray === undefined) {
          missingHaystack = true;
          haystackStatus = 'absent';
        } else {
          if (!Array.isArray(haystackArray)) {
            haystackArray = [haystackArray];
          }
        }
        if (needleArray === undefined) {
          missingNeedles = true;
          needlesStatus = 'absent';
        } else {
          if (!Array.isArray(needleArray)) {
            needleArray = [needleArray];
          }
        }
        var result = {};
        if (missingHaystack || missingNeedles) {
          result.pass = false;
          result.message = "Haystack Array: " + haystackStatus + "; Needle Array: " + needlesStatus + "; both must be present to validate";
        } else {
          result.pass = true;
          for (var i = 0; i < needleArray.length; i++) {
            var needle = needleArray[i];
            var itemFound = false;
            for (var j = 0; j < haystackArray.length; j++) {
              var haystackItem = haystackArray[j];
              if (haystackItem == needle) {
                itemFound = true;
                break;
              }
            }
            if (!itemFound) {
              result.pass = false;
              break;
            }
          }

          if (result.pass) {
            result.message = "Expected needle array items '" + needleArray + "' NOT to be found within haystack array '" + haystackArray + "'";
          } else {
            result.message = "Expected needle array items '" + needleArray + "' to be found within haystack array '" + haystackArray + "'";
          }
        }
        return result;
      }
    };
  },
};

util.itHelper = function(fn) {
    return done => {
        fn.call().then(done, err => {
            done(err);
        });
    }
};
