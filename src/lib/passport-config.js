import passport from 'passport'

import { Strategy } from 'passport-local'

import { db } from './db.js'

import { compare } from 'bcrypt'

passport.use(new Strategy(async (email, password, done) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], async (result, error) => {
    if (error) {
      console.error(error)
    } else {
      if (result[0].id === undefined) {
        return done(null, false, {
          message: 'User doesnt exists'
        })
      }

      if (!(await compare(password, result[0].password))) {
        return done(null, false, {
          message: 'Wrong password'
        })
      }

      return done(null, result[0].id)
    }
  })
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], (error, result) => {
    if (error) {
      console.error(error)
      return done(error)
    }

    if (result[0] === undefined) {
      return done(null, false, {
        message: 'User doesnt exist'
      })
    }

    const user = result[0]

    done(null, user)
  })
})

export { passport }
