import { Router } from 'express'

import { db } from '../lib/db.js'

import { hash } from 'bcrypt'

const router = Router()

router.post('/api/register', async (req, res, next) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const passwordHash = await hash(password, 8)

  db.query('INSERT INTO users (username, email, password) VALUE (?, ?, ?)', [username, email, passwordHash], async (error) => {
    if (error !== null) {
      return res.json({
        err: error.code
      })
    }

    db.query('SELECT id FROM users WHERE email = ?', [email], (err, userResult) => {
      if (err !== null) {
        return res.json({ err: true })
      }

      const userId = userResult[0].id

      req.login(userId, function (err) {
        if (err) {
          console.log(err)
        }
        return res.json({ err: false })
      })
    })
  })
})

export { router as apiRoutes }
