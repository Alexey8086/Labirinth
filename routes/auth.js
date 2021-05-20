const {Router} = require('express')
const router = Router()
// Подключение встроенной библиотеки для шифрования данных
const crypto = require('crypto')
const {validationResult} = require('express-validator')
// Подключение библиотеки для шифрования данных
const bcrypt = require('bcryptjs')
// Подключение модели пользователя
const userSchema = require('../models/user')
// Подключение библиотек для отправки писем по email
const nodemailer = require('nodemailer')
const mailgun = require('nodemailer-mailgun-transport')
// Импорт api key из самописного конфига
const KEYS = require('../keys')
// Подключение объекта конфигурации email-письма
const regEmail = require('../emails/registration')
// Импорт конфигурации письма для сброса пароля
const resetEmail = require('../emails/reset')
const {registerValidators} = require('../utils/validators')

const authConfig = {
  auth: {
    api_key: KEYS.MAILGUN_API_KEY,
    domain: KEYS.MAILGUN_DOMAIN
  }
}

const transporter = nodemailer.createTransport(mailgun(authConfig))

router.get('/login', async (req, res) => {

  if (req.session.isAuthenticated) {
    return res.redirect('/profile')
  } else {
    res.render('auth/login', {
      style: '/auth/auth.css',
      title: 'Личный кабинет',
      isLogin: true,
      loginError: req.flash('loginError'),
      registerError: req.flash('registerError')
    })
  }
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email.toLowerCase()
    const password = req.body.password

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
            res.redirect('/profile')
          }
        })
      } else {
        req.flash('loginError', 'Введён неверный пароль!')
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

router.post('/register', registerValidators, async (req, res) => {
  try {
    const {email, password, name} = req.body
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#register')
    }


    // шифрования пароля
    const hashPassword = await bcrypt.hash(password, 10)
    const user = new userSchema({
      email: email.toLowerCase(),
      name,
      password: hashPassword,
      card: {items: []}
    })
    await user.save()
    res.redirect('/auth/login#login')
    await transporter.sendMail(regEmail(email))

  } catch (e) {
    console.log(e)
  }
})

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    style: '/auth/auth.css',
    title: 'Сброс пароля',
    isReset: true,
    error: req.flash('error'),
    message: req.flash('message')
  })
})

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login')
  }

  try {
    const user = await userSchema.findOne({
      // Проверка наличия токена для сброса пароля
      resetToken: req.params.token,
      // Проверка времени жизни токена
      resetTokenExpiration: {$gt: Date.now()}
    })

    if (!user) {
      return res.redirect('/auth/login')
    } else {
      res.render('auth/password', {
        style: '/auth/auth.css',
        title: 'Создание нового пароля',
        isNewPassword: true,
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Что-то пошло не так, попробуйте ещё раз позже')
        return res.redirect('/auth/reset')
      }

      const token = buffer.toString('hex')
      const candidate = await userSchema.findOne({email: req.body.email})

      if (candidate) {
        // Инициализация токена для сброса пароля у пользователя
        candidate.resetToken = token
        // Задание времени жизни для токена (1 час в миллисекундах)
        candidate.resetTokenExpiration = Date.now() + 60 * 60 * 1000
        // Ждём пока функция "save" сохранит данные в БД
        await candidate.save()
        // Ждём пока фуккция "sendMail" отправит письмо для восстановления пароля на почту пользователя
        await transporter.sendMail(resetEmail(candidate.email, token))
        req.flash('message', 'Для смены пароля, пожалуйста, следуйте инструкциям. Инструкции изложены в письме, которое отправлено на адрес указанной вами электронной почты.')
        res.redirect('/auth/reset')
      } else {
        req.flash('error', 'Пользователь с введённым email не найден!')
        res.redirect('/auth/reset')
      }
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await userSchema.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExpiration: {$gt: Date.now()}
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExpiration = undefined
      await user.save()
      res.redirect('/auth/login')
    } else {
      req.flash('loginError', 'Время действия токена истекло')
      res.redirect('/auth/login')
    }

  } catch (error) {
    console.log(error)
  }
})

module.exports = router