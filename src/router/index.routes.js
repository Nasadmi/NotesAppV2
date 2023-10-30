import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('index', {
    title: 'NotesApp',
    theme: req.cookies.theme
  })
})

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'NotesApp',
    theme: req.cookies.theme
  })
})

export { router as indexRoutes }
