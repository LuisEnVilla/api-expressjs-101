function handler (User) {
  return (req, res, next) => {
    User.findOne(req.schema).exec()
      .then(user => {
        if (!user) return res.boom.badRequest('User not found in db')
        user.generateUUID()
        return res.status(201).jsonp({ message: "Generated code" })
      }).catch(next)
  }
}

module.exports = (router, permissions, schema, User) => {
  router.get(
    '/user/recovery',
    schema.validate('user', ['query'], { required: ['email'] }),
    handler(User)
  )
}