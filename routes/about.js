const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {

  res.render('about', {
    style: '/about/about.css',
    title: 'О компании',
    isAbout: true,
  })

})

module.exports = router