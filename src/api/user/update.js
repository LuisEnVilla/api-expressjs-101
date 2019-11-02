function handler (User) {
  return (req, res, next) => {
    User.findOneAndUpdate(
      { _id: req.schema._id },
      req.schema,
      { new: true, runValidators: true, fields: '-password -__v' }
    ).exec().then(resUpdate => {
      if (!resUpdate) return res.status(204).send()
      return res.status(200).jsonp(resUpdate)
    }).catch(next)
  }
}

module.exports = (router, permissions, schema, User) => {
  router.put(
    '/user/:_id',
    permissions.check('ROOT'),
    schema.validate('user', ['body', 'params'], { required: ['_id'], include: ['name', 'email', 'password', 'level', '_id'] }),
    handler(User)
  )
}