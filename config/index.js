class Config {
  constructor() {
    this.dbConfig = require('./db')
    this.serverConfig = require('./server')
    this.joiConfig = require('./joi')
  }

  get db () {
    this.dbConfig.dbUri = process.env.DB_LOGIN?
      `mongodb://${this.dbConfig.user}:${this.dbConfig.password}@${this.dbConfig.address}:${this.dbConfig.port}/${this.dbConfig.database}`:
      `mongodb://${this.dbConfig.address}:${this.dbConfig.port}/${this.dbConfig.database}`
    return this.dbConfig
  }

  get server() {
    return this.serverConfig
  }

  get joi () {
    return this.joiConfig
  }

}

module.exports = new Config()