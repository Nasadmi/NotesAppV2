import { Router } from 'express'

import { ensureAuthenticated } from '../middlewares/authenticator-routes.js'

const router = Router()

router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
  res.render('dashboard', {
    user: {
      username: req.user.username,
      email: req.user.email,
      id: req.user.id
    }
  })
})

export { router as profileRoutes }
