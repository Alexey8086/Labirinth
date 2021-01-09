const {Router} = require('express')
const Ticket = require('../models/ticket')
  //middleware, который закрывает доступ к странице для неавторизованных пользователей
const auth = require('../middleware/auth')
const router = Router()
const KEYS = require('../keys')

function userIsAdmin(req, ADMIN_ID) {
  return req.user._id.toString() === ADMIN_ID
}

router.get('/', auth, (req, res) => {
  // Если пользователь не является администратором,
  // то страница создания абонемента не откроется
  if (!userIsAdmin(req, KEYS.ADMIN_ID)) {
    return res.redirect('/tickets')
  }

  res.render('add', {
    style: '/add/add.css',
    title: 'Добавить абонемент',
    isAdd: true
  })
})

router.post('/', auth, async (req, res) => {
  // Если пользователь не является администратором,
  // то он не сможет создать новый абонемент
  if (!userIsAdmin(req, KEYS.ADMIN_ID)) {
    return res.redirect('/tickets')
  }

  const ticket = new Ticket({
    title: req.body.title,
    price: req.body.price,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    userId: req.user._id
  })

  try {
    await ticket.save()
    res.redirect('/tickets')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router