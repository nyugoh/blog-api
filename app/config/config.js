'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');

var rootPath = path.normalize(__dirname + '/../');

_dotenv2.default.config();
var env = process.env.NODE_ENV;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: process.env.PORT || 5000,
    db: process.env.MONGODB_DEV
  },

  test: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: process.env.PORT || 4000,
    db: "mongodb://test:TestMaker20@ds117431.mlab.com:17431/mocha-tests-builds"
  },

  production: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: process.env.PORT || 3000,
    db: process.env.MONGODB_PROD
  }
};

module.exports = config[env];
