function handler(User) {
  return (req, res, next) => {
    User.findOneAndUpdate(
      req.schema, 
      { isValidated: true, $unset: { uuid: 1 }},
      { new: true, runValidators: true, fields: 'name level email' }
    ).exec()
    .then( user => {
      if (!user) return res.boom.badRequest('Code not found')
      return res.status(200).jsonp(user)
    }).catch(next)
  }
}

module.exports = (router, permissions, schema, User) => {
  router.get(
    '/user/validate',
    schema.validate('user', ['query'], { required: ['uuid'] }),
    handler(User)
  )
}