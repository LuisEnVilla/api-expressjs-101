class USER {
  constructor(mongoose, router, configAuth, schemas, permissions) {
    this.router = router
    this.schemas = schemas
    this.permissions = permissions
    this.model = require('./model')(mongoose, configAuth)
  }

  deployRoutes (names = []) {
    names.forEach( name => {
      require(`./${name}`)(this.router, this.permissions, this.schemas, this.model)
    })
  }

}

module.exports = (mongoose, router, config, Schema, permissions) => {
  const User = new USER(mongoose, router, config.server.auth, Schema, permissions)
  User.deployRoutes(['create', 'list', 'update', 'delete', 'login', 'recovery', 'validate','change-password'])
  return User.model
}