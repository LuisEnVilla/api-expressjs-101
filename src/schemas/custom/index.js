'use strict';

module.exports = (Joi) => ({
  name: 'string',
  base: Joi.string(),
  language: {
    capitalize: 'debe ser una cadena de texto capitalizada o que se pueda capitalizar',
    objectid: 'debe ser un identificador valido',
    rfc: 'debe ser un RFC valido',
    curp: 'debe ser un CURP valido',
    phone: 'debe ser un teléfono de 10 caracteres',
    emailfull: 'debe ser un correo electrónico válido'
  },
  pre(value, state, options) {
    if (options.convert && this._flags.capitalize) {
      return value.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase())
    }
    else return value
  },
  rules: [
    {
      name: 'capitalize',
      setup(params) {
        this._flags.capitalize = true
      },
      validate(params, value, state, options) {
        if ((typeof value === 'string') && (value.length === 0 || value.match(/(^|\s)\S/g).every(firstCharacter => firstCharacter === firstCharacter.toUpperCase()))) {
          return value
        }
        else return this.createError('string.capitalize', { v: value }, state, options)
      }
    },
    {
      name: 'objectid',
      validate(params, value, state, options) {
        if (typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)) {
          return value
        }
        else return this.createError('string.objectid', { v: value }, state, options)
      }
    },
    {
      name: 'rfc',
      validate(params, value, state, options) {
        if (typeof value === 'string' && /^[A-Z,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,AZ]$/.test(value)) {
          return value
        }
        else return this.createError('string.rfc', { v: value }, state, options)
      }
    },
    {
      name: 'curp',
      validate(params, value, state, options) {
        if (typeof value === 'string' && /^[A-Z][A,E,I,O,U,X][A-Z]{2}[0-9]{2}[0-1][0-9][0-3][0-9][M,H][A-Z]{2}[B,C,D,F,G,H,J,K,L,M,N,Ñ,P,Q,R,S,T,V,W,X,Y,Z]{3}[0-9,A-Z][0-9]$/.test(value)) {
          return value
        }
        else return this.createError('string.curp', { v: value }, state, options)
      }
    },
    {
      name: 'phone',
      validate(params, value, state, options) {
        if (typeof value === 'string' && /^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$/.test(value)) {
          return value
        }
        else return this.createError('string.phone', { v: value }, state, options)
      }
    },
    {
      name: 'emailfull',
      validate(params, value, state, options) {
        if (typeof value === 'string' && /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
          return value
        }
        else return this.createError('string.emailfull', { v: value }, state, options)
      }
    }
  ]
})
