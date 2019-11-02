module.exports = {
  address: process.env.DB_ADDRESS || '127.0.0.1',
  port: process.env.DB_PORT || 27017,
  database: process.env.DB_NAME || 'name',
  user: process.env.PWS_USER || 'api',
  password: process.env.PWS_PASS || 'pwsIsGood',
  config: {
    debug: process.env.DB_DEBUG || true,
    autoIndex: true,
    useFindAndModify: false
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}