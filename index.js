'use strict'

// dependencies
const express = require('express')
const http = require('http')
const { createTerminus } = require('@godaddy/terminus');
const mongoose = require('mongoose')
const compression = require('compression')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const jwtMiddleware = require('express-jwt')
const boom = require('express-boom')
const config = require('./config')

// Database get config
mongoose.Promise = Promise
const opMongose = {
  config: config.db.config,
  useNewUrlParser: config.db.useNewUrlParser,
  useUnifiedTopology: config.db.useUnifiedTopology,
  useCreateIndex: config.db.useCreateIndex,
  useFindAndModify: config.db.useFindAndModify
}

// Logging Morgan costum
morgan.token('user_name', (req, res) => (req.user && req.user.email) ? `<${req.user.email}>` : '<N/A USER>')

// Server set config
const app = express()
app.set('port', config.server.port)
app.use(helmet())
app.use(compression({ level: 9 }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '5mb' }))
app.use(morgan('> :date[iso] :user_name --> [:method] :url [:status] ( :response-time ms ) '))
app.use(boom())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

// Authenticate config
const authenticate = jwtMiddleware({
  secret: config.server.auth.secret,
  credentialsRequired: config.server.auth.credentialsRequired,
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}).unless(config.server.auth.unless)

// Middleware error authenticate
const errorAuthenticate = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') return res.boom.unauthorized('Invalid authorization token')
  next()
}

// Error handler
const handlingValidationErrors = (err, req, res, next) => {
  if (res.headersSent) return next(err)
  else if (err.code === 'permission_denied' || err.status == 403) return res.boom.unauthorized('unauthorized user')
  else if (err.name && err.name === 'ValidationError' && err.details && err.details[0].message) {
    console.log(err.annotate())
    return res.boom.badRequest(err.details[0].message)
  }
  else if (err.name && err.name === 'ValidationError') return res.boom.badRequest(err.message)
  else if (err.name && err.name === 'MongoError') return res.boom.badRequest(err.errmsg)
  else {
    console.log(err)
    return res.boom.badImplementation('An internal server error occurred.')
  }
}


//Graceful Shutdown
function healthCheck() {
  console.log('\n--> [SERVER] server check connection db')
  return mongoose.connection.db.admin().ping()
}

function onSignal() {
  console.log('\n--> [SERVER] server is starting cleanup!')
  return mongoose.connection.close()
}

function onShutdown() {
  console.log('--> [SERVER] cleanup finished, server is shutting down');
}

const optionsTerminus = {
  timeout: 2000,
  signals: ['SIGINT', 'SIGTERM'],
  onSignal,
  healthChecks: {
    '/healthcheck': healthCheck
  },
  onShutdown,
  logger: console.log
}

// Router
const router = express.Router()
require('./src/api')(router, mongoose, config)
app.use('/api', authenticate, errorAuthenticate, router, handlingValidationErrors)

// Initial Database and Server
mongoose.connect(config.db.dbUri, opMongose).then(
  () => {
    createTerminus(http.createServer(app), optionsTerminus)
      .listen(app.get('port'), (err) => {
        console.log(`Server running on port ${app.get("port")}`)
      })
  },
  err => {
    console.log(`--> ERROR in database connect`)
    console.log(err);
  }
)

// Event Database
mongoose.connection.on('connected', () => {
  console.log(`--> [MONGOOSE] Database connected: ${config.db.dbUri}`)
})
mongoose.connection.on('disconnected', () => {
  console.log(`--> [MONGOOSE] Database disconnected`)
})
mongoose.connection.on('error', () => {
  console.log(`--> [MONGOOSE] ERROR in database connect`)
})

