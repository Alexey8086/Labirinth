const {Router} = require('express')
const { functions } = require('firebase')
const Ticket = require('../models/ticket')
const router = Router()

// функция приведения объекта, полученного из бд, к валидному виду "плоского объекта" 
function mapCardItems(card) {
  return card.items.map(i => ({
    ...i.ticketId._doc,
    count: i.count
  }))
}

// функция вычисления общей стоимости всех товаров в корзине
function computePrice(tickets) {
  return tickets.reduce((total, ticket) => {
    return total += ticket.price * ticket.count
  }, 0)
}

router.post('/add', async(req, res) => {
  const ticket = await Ticket.findById(req.body.id)
  await req.user.addToCard(ticket)
  res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
  const card = await Card.remove(req.params.id)
  res.status(200).json(card)
})

router.get('/', async(req, res) => {
  const user = await req.user
    .populate('card.items.ticketId')
    .execPopulate()

  const tickets = mapCardItems(user.card)

  res.render('card', {
    title: 'Корзина',
    style: '/card/card.css',
    isCard: true,
    tickets: tickets,
    price: computePrice(tickets)
  })
})

module.exports = router