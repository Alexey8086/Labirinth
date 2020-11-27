const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {

  res.render('auth', {
    style: '/auth/user-auth.css',
    title: 'Вход в личный кабинет',
    isAuth: true,
  })

})

module.exports = router