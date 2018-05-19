const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/api-development'
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
