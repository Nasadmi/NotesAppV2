import express from 'express'

import session from 'express-session'

import cookieParser from 'cookie-parser'

import cors from 'cors'

import passport from 'passport'

import morgan from 'morgan'

import { join } from 'node:path'

import { config } from 'dotenv'

import { __dirname } from '../__dirname.js'

import { db } from '../lib/db.js'

const app = express()

config()

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}))

app.use(cookieParser())

app.use(passport.initialize())

app.use(passport.session())

app.use(cors())

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'))
}

app.set('views', join(__dirname, 'views'))

app.set('view engine', 'ejs')

app.use('resources', express.static(join(__dirname, 'public')))

app.set('port', process.env.PORT || 5000)

app.listen(app.get('port'), () => {
  console.log('Server is listening on port', app.get('port'))
})

db.connect(err => {
  if (err !== null) {
    console.error(err)
  } else {
    console.log('Connected to database')
  }
})