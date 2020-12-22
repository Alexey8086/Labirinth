const {Router} = require('express')
const router = Router()

router.get('/login', async (req, res) => {

  res.render('auth/login', {
    style: '/auth/auth.css',
    title: 'Вход в личный кабинет',
    isLogin: true,
  })

})

module.exports = router