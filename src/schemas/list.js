module.exports = (Joi, config) => {
  return {
    conditions: Joi.object().label('condiciones'),
    fields: Joi.string().label('campos'),
    options: Joi.object().keys({
      sort: Joi.object().label('ordenar'),
      limit: Joi.number().label('limite'),
      skip: Joi.number().label('omitir'),
      maxscan: Joi.number().label('escaneo máximo')
    }).label('opciones')
  }
}
