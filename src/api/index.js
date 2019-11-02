const permissions = require('express-jwt-permissions')()
const SchemaClass = require('../schemas')

module.exports = (router, mongoose, config) => {
  const Schema = new SchemaClass(config)
  

  //CRUDS
  const USER = require('./user')(mongoose, router, config, Schema, permissions)
  

}