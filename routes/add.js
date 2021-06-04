const {Router} = require('express')
const Ticket = require('../models/ticket')
const User = require('../models/user')
  //middleware, который закрывает доступ к странице для неавторизованных пользователей
const auth = require('../middleware/auth')
const router = Router()
const {validationResult} = require('express-validator')
const {ticketValidators} = require('../utils/validators')

async function userIsAdmin(userId) {
  try {
    const user = await User.findById(userId)
    return user.role
  } catch (e) {
    console.log(e)
  }
}

router.get('/', auth, async (req, res) => {
  // Если пользователь не является администратором,
  // то страница создания абонемента не откроется
  let isAdmin = await userIsAdmin(req.session.user._id)
  if (!isAdmin) {
    return res.redirect('/tickets')
  }

  res.render('add', {
    style: '/add/add.css',
    title: 'Добавить абонемент',
    isAdd: true
  })
})

router.post('/', auth, ticketValidators, async (req, res) => {
  // Если пользователь не является администратором,
  // то он не сможет создать новый абонемент
  let isAdmin = await userIsAdmin(req.session.user._id)
  if (!isAdmin) {
    return res.redirect('/tickets')
  }

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      style: '/add/add.css',
      title: 'Добавить абонемент',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        description: req.body.description,
        duration: req.body.duration,
        ticketsAmount: req.body.ticketsAmount
      }
    })
  }

  const ticket = new Ticket({
    title: req.body.title,
    price: req.body.price,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    description: req.body.description,
    duration: req.body.duration,
    ticketsAmount: req.body.ticketsAmount,
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