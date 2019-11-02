function handler (User) {
  return (req, res, next) => {
    User.findOne({ email: req.schema.email }).exec()
    .then( user => {
      if (!user) return res.boom.badRequest('User not found in db')
      user.comparePassword(req.schema.password, (err, isMatch) => {
        if (err) return res.boom.badImplementation('Compare password')
        else if (!isMatch) return res.boom.badRequest('password faild')
        else {
          const { name, email, level, _id  } = user
          const token = user.getJWT()
          return res.status(200).jsonp({ name, email, level, _id, token })
        }
      })
    }).catch(next)
  }
}

module.exports = (router, permissions, schema, User) => {
  router.post(
    '/user/login',
    schema.validate('user', ['body'], { required: ['email', 'password'] }),
    handler(User)
  )
}