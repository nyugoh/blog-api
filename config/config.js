const path = require('path');
import dotenv from 'dotenv';
const rootPath = path.normalize(__dirname + '/..');

dotenv.config();
const env = process.env.NODE_ENV || 'development';

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
    db: 'mongodb://localhost/api-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/api-production'
  }
};

module.exports = config[env];
