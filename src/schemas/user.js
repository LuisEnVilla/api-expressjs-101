module.exports = (Joi, config) => {
  return {
    name: Joi.string().min(3).label('Nombre de usuario'),
    email: Joi.string().trim().lowercase().email().emailfull().label('correo'),
    password: Joi.string().trim().label('contraseña'),
    level: Joi.string().valid(config.server.auth.level).label('nivel'),
    uuid: Joi.string().guid({ version: 'uuidv4' }).label('token'),
    archived: Joi.boolean().label('archivado'),
    isValidated: Joi.boolean().label('validacion'),
    _id: Joi.string().objectid().label('identificador')
  }
}
