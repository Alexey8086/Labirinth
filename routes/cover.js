const {Router} = require('express')
const router = Router()

router.get('/', async (req, res) => {

  res.render('index', {
    style: '/cover/cover.css',
    title: 'Главная страница',
    isCover: true
  })
})

module.exports = router