import { Router } from 'express'

import { db } from '../lib/db.js'

import { compare, hash } from 'bcrypt'

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

router.post('/api/login', (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  db.query('SELECT id, password FROM users WHERE email = ?', [email], async (err, userResult) => {
    if (err !== null) {
      return res.json({ err: true, message: err.message })
    }

    if (userResult[0].id === undefined) {
      return res.json({
        err: true,
        message: 'user not exists'
      })
    }

    if (!(await compare(password, userResult[0].password))) {
      return res.json({
        err: true,
        message: 'wrong password'
      })
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

router.delete('/api/notes/delete/:uuid', (req, res, next) => {
  const uuid = req.params.uuid
  if (uuid === undefined) {
    return res.json({
      err: true
    })
  }

  db.query('DELETE FROM notes WHERE uuid = ?', [uuid], (err) => {
    if (err) {
      return res.json({
        err: true
      })
    }

    res.json({
      err: false
    })
  })
})

router.post('/api/profile/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.json({ error: true })
    }
    req.session.destroy((err) => {
      if (err) {
        return res.json({ error: true })
      }
      res.json({ error: false })
    })
  })
})

router.post('/api/note/add', (req, res, next) => {
  const title = req.body.title
  const content = req.body.content
  const user = req.user.id

  db.query('INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)', [user, title, content], (err) => {
    if (err) {
      return res.json({ err: true })
    }
    res.json({ err: false })
  })
})

export { router as apiRoutes }
