const path = require('path');
import dotenv from 'dotenv';
const rootPath = path.normalize(__dirname + '/..');

dotenv.config();
const env = process.env.NODE_ENV;

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: process.env.PORT || 3000,
    db: process.env.MONGODB
  },

  test: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://tester:Tester20@ds117431.mlab.com:17431/mocha-tests-builds'
  },

  production: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: process.env.PORT || 3000,
    db: process.env.MONGODB
  }
};

module.exports = config[env];
