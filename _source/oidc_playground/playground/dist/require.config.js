/*!
 * Copyright (c) 2015-2016, Okta, Inc. and/or its affiliates. All rights reserved.
 */

//eslint-disable-next-line no-unused-vars
var require = {
  baseUrl: 'dist',
  urlArgs: 'sha=sha_placeholder',
  paths: {
    vendor: 'shared/vendor',
    okta: 'shared/util/Okta',
    jquery: 'shared/vendor/lib/jquery-1.11.3',
    q: 'shared/vendor/lib/q',
    jqueryui: 'shared/vendor/lib/jquery-ui-1.10.4.custom',
    underscore: 'shared/vendor/lib/underscore-1.8.3',
    backbone: 'shared/vendor/lib/backbone-1.2.1',
    i18n: 'shared/vendor/plugins/i18n',
    handlebars: 'shared/vendor/lib/handlebars-v2.0.0',
    imagesloaded: 'shared/vendor/plugins/imagesloaded',
    'eventEmitter/EventEmitter': 'shared/vendor/plugins/EventEmitter',
    'eventie/eventie': 'shared/vendor/plugins/eventie',
    qtip: 'shared/vendor/plugins/jquery.qtip',
    mixpanel: 'shared/vendor/lib/mixpanel-2.8.0.min'
  },
  map: {
    '*': {
      'underscore': 'shared/vendor/lib/underscore-wrapper',
      'jqueryui': 'shared/vendor/lib/jqueryui-wrapper',
      'shared/util/Bundles': 'util/Bundles'
    },
    'shared/vendor/lib/jqueryui-wrapper': {
      'jqueryui': 'jqueryui'
    },
    'shared/vendor/lib/underscore-wrapper': {
      'underscore': 'underscore'
    },
    'shared/vendor/lib/handlebars-wrapper': {
      'handlebars': 'handlebars'
    }
  }
};
