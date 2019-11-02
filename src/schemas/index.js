const BaseJoi = require('joi');
const Custom = require('./custom')
const Joi = BaseJoi.extend(Custom)

class Schemas {

  constructor (config) {
    this.config = config
  }

  builder(validations, params) {
    let newValidationSchema = validations
    if (params.forbidden && params.forbidden.length > 0) {
      params.forbidden.forEach(e => newValidationSchema[e] = newValidationSchema[e].concat(Joi.forbidden()))
    }
    if (params.required && params.required.length > 0) {
      params.required.forEach(e => newValidationSchema[e] = newValidationSchema[e].concat(Joi.required()))
    }
    if (params.excluded && params.excluded.length > 0) {
      params.excluded.forEach(e => delete newValidationSchema[e])
    }
    if (params.include && params.include.length > 0) {
      let newValidationSchemaAux = {}
      params.include.forEach(e => newValidationSchemaAux[e] = newValidationSchema[e])
      newValidationSchema = newValidationSchemaAux
    }
    return Joi.object().keys(newValidationSchema).required()
  }

  getSchema (name, params) {
    const atributes = require(`./${name}`)(Joi, this.config)
    return this.builder(atributes, params)
  }

  validate (name, getData, params = {}) {
    return (req, res, next) => {
      const requestData = getData.reduce((before, field) => {
        return Object.assign(before, req[field])
      }, {})
      Joi.validate(requestData, this.getSchema(name, params), this.config.joi)
        .then(payload => {
          req.schema = payload
          return next()
        }).catch(next)
    }
  }

}

module.exports = Schemas