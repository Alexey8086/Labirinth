const {Router} = require('express')
const Card = require('../models/card')
const Ticket = require('../models/ticket')
const router = Router()

router.post('/add', async(req, res) => {
  const ticket = await Ticket.getById(req.body.id)
  await Card.add(ticket)
  res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
  const card = await Card.remove(req.params.id)
  res.status(200).json(card)
})

router.get('/', async(req, res) => {
  const card = await Card.fetch()
  res.render('card', {
    title: 'Корзина',
    style: '/card/card.css',
    isCard: true,
    tickets: card.tickets,
    price: card.price
  })
})

module.exports = router