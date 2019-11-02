function handler(User) {
  return (req, res, next) => {
    User.find(
      req.schema.conditions,
      req.schema.fields || 'name email level archived uuid',
      req.schema.options
    ).exec().then(resFinder => {
      return res.status(200).jsonp(resFinder)
    }).catch(next)
  }
}

module.exports = (router, permissions, schema, User) => {
  router.get(
    '/user',
    permissions.check('ROOT'),
    schema.validate('list', ['body','query']),
    handler(User)
  )
}