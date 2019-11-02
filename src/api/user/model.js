const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

module.exports = (mongoose, config) => {

  let usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
    password: { type: String, required: true },
    level: { type: String, required: true, enum: config.level },
    uuid: String,
    archived: { type: Boolean, default: false },
    isValidated: { type: Boolean, default: false }
  }, { timestamps: true })

  // Middleware create user
  usersSchema.pre('save', function (next) {
    if (this.isNew && this.password && this.email) {
      this.password = bcrypt.hashSync(this.password.trim(), 10)
    }
    next()
  })

  // Middleware update user
  usersSchema.pre('findOneAndUpdate', function (next) {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password.trim(), 10)
    return next()
  })

  // metodo para compara password
  usersSchema.methods.generateUUID = function () {
    this.uuid = uuid.v4()
    this.save()
  }

  usersSchema.methods.comparePassword = function (pass, cb) {
    bcrypt.compare(pass, this.password, (err, isMatch) => {
      if (err) return cb(err)
      return cb(null, isMatch)
    })
  }
  usersSchema.methods.comparePasswordSync = function (pass) {
    return bcrypt.compareSync(pass, this.password)
  }

  // metodo para generar JWT
  usersSchema.methods.getJWT = function () {
    const data = {
      _id: this._id,
      name: this.name,
      email: this.email,
      level: this.level,
      permissions: config.permissions[this.level]
    }
    const configToken = { expiresIn: config.expiration[this.level] }
    const token = jwt.sign(data, config.secret, configToken)

    return `Bearer ${token}`
  }
  return mongoose.model('user', usersSchema)
}