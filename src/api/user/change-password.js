function handler (User) {
  return (req, res, next) => {
    User.findOneAndUpdate(
      { uuid: req.schema.uuid },
      { password: req.schema.password, $unset: { uuid: 1 } },
      { new: true, runValidators: true, fields: 'name level email permissions' }
    ).exec()
      .then( user => {
        if (!user) return res.boom.badRequest('Code not found')
        const { name, email, level, _id } = user
        const token = user.getJWT()
        return res.status(200).jsonp({ name, email, level, _id, token })
      })
      .catch(next)
  }
}

module.exports = (router, permissions, schema, User) => {
  router.post(
    '/user/change-password',
    schema.validate('user', ['body'], { required: ['password','uuid'] }),
    handler(User)
  )

  router.post(
    '/user/validate',
    schema.validate('user', ['body'], { required: ['password', 'uuid'] }),
    handler(User)
  )
}