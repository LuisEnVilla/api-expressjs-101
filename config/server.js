const pathToRegexp = require('path-to-regexp');

module.exports = {
  port: process.env.PORT || 3000,
  auth: {
    secret: "pwsIsGood",
    credentialsRequired: false,
    expiration: {
      ROOT: "7d",
      USER: "1d"
    },
    level: ['ROOT', 'USER'],
    unless: {
      path: [
        "/user/login",
        "/user/recovery",
        "/user/validate",
        "/user/change-password",
        /*"/api/recovery",
        "/api/change-password",
        pathToRegexp('/api/change-password/:uuid'),
        '/api/signup',
        pathToRegexp('/api/users/validate/:uuid')*/
      ]
    },
    permissions: {
      ROOT: [ "ALL", "ROOT"],
      USER: [ "ALL", "USER" ]
    }
  }
}