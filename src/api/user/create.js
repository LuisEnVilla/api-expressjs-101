function handler(User) {
  return (req, res, next) => {
    User.create(req.schema)
    .then( newUser => {
      const { name, email, level, _id } = newUser
      return res.status(201).jsonp({ name, email, level, _id })
    })
    .catch(next)
  }
}

module.exports = (router, permissions, schema, User) => {
  router.post(
    '/user',
    permissions.check('ROOT'),
    schema.validate('user', ['body'], { required: ['name', 'email', 'password', 'level'] }),
    handler(User)
  )
}