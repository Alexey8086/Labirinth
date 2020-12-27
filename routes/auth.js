const {Router} = require('express')
const router = Router()
// Подключение библиотеки для шифрования данных
const bcrypt = require('bcryptjs')
// Подключение модели пользователя
const userSchema = require('../models/user')

router.get('/login', async (req, res) => {

  res.render('auth/login', {
    style: '/auth/auth.css',
    title: 'Личный кабинет',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body

    const candidate = await userSchema.findOne({ email })

    if (candidate) {
      const isSame = await bcrypt.compare(password, candidate.password)

      if (isSame) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          } else {
            res.redirect('/tickets')
          }
        })
      } else {
        req.flash('loginError', 'Введённые пароли не совпадают!')
        res.redirect('/auth/login#login')
      }

    } else {
      req.flash('loginError', 'Пользователь не найден!')
      res.redirect('/auth/login#login')
    }

  } catch (error) {
    console.log(error)
  }
})

router.post('/register', async (req, res) => {
  try {
    const {email, password, confirm, name} = req.body
    const candidate = await userSchema.findOne({ email })

    if (candidate) {
      req.flash('registerError', 'Пользователь с таким email уже существует!')
      res.redirect('/auth/login#register')
    } else {
      // шифрования пароля
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new userSchema({
        email,
        name,
        password: hashPassword,
        card: {items: []}
      })
      await user.save()
      res.redirect('/auth/login#login')
    }

  } catch (error) {
    console.log(error)
  }
})

module.exports = router