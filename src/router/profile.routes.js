import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/authenticator-routes.js'

import { db } from '../lib/db.js'

const router = Router()

router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
  db.query('SELECT uuid, title, content, created_at FROM notes WHERE user_id = ?', [req.user.id], (err, result) => {
    if (err) {
      return console.log(err)
    }
    res.render('dashboard', {
      user: {
        username: req.user.username,
        email: req.user.email,
        id: req.user.id
      },
      title: 'NotesApp',
      theme: req.cookies.theme,
      notes: result
    })
  })
})

export { router as profileRoutes }
