function handler (User) {
  return (req, res, next) => {
    User.deleteOne( { _id: req.schema._id }).exec()
    .then(resDelete => {
      return res.status(200).jsonp(resDelete)
    }).catch(next)
  }
}

module.exports = (router, permissions, schema, User) => {
  router.delete(
    '/user/:_id',
    permissions.check('ROOT'),
    schema.validate('user', ['params'], { required: ['_id'] }),
    handler(User)
  )
}