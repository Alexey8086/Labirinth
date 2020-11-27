const {Router} = require('express')
const Ticket = require('../models/ticket')
const router = Router()

router.get('/', (req, res) => {
  res.render('add', {
    style: '/add/add.css',
    title: 'Добавить абонемент',
    isAdd: true
  })
})

router.post('/', async (req, res) => {
  const ticket = new Ticket(req.body.title, req.body.price, req.body.option1, req.body.option2, req.body.option3)

  await ticket.save()

  res.redirect('/tickets')
})

module.exports = router