const {Router} = require('express')
const User = require('../models/user')
const Ticket = require('../models/ticket')
  // middleware, который закрывает доступ к странице для неавторизованных пользователей
const auth = require('../middleware/auth')
const router = Router()

  // функция приведения объекта, полученного из бд, к валидному виду "плоского объекта" 
function mapCardItems(card) {
  obj = []

  card.items.forEach(el => {
    if (el.ticketId) {
      obj.push({
        ...el.ticketId._doc,
        id: el.ticketId.id,
        count: el.count
      })
    }
  })

  return obj

  // return card.items.map(i => ({
  //   ...i.ticketId._doc,
  //   id: i.ticketId.id,
  //   count: i.count
  // }))
}

  // функция вычисления общей стоимости всех товаров в корзине
function computePrice(tickets) {
  return tickets.reduce((total, ticket) => {
    return total += ticket.price * ticket.count
  }, 0)
}

router.post('/add', auth, async(req, res) => {
  const id = req.body.id
  const ticket = await Ticket.findById(id)
  let ticketsAmount = ticket.ticketsAmount

  if (ticketsAmount > 0) {
    ticketsAmount--

    Ticket.findByIdAndUpdate(id, {"ticketsAmount": ticketsAmount}, (err, result) => {
      if (err) {console.log(err)}
    })
  }

  await req.user.addToCard(ticket)
  res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    const ticket = await Ticket.findById(id)
    let ticketsAmount = ticket.ticketsAmount

    if (ticketsAmount >= 0) {
      ticketsAmount++
  
      Ticket.findByIdAndUpdate(id, {"ticketsAmount": ticketsAmount}, (err, result) => {
        if (err) {console.log(err)}
      })
    }

    await req.user.removeFromCard(id)
    const user = await req.user
      .populate('card.items.ticketId')
      .execPopulate()
  
    const tickets = mapCardItems(user.card)
    const card = {
      tickets,
      price: computePrice(tickets)
    }
  
    res.status(200).json(card)
    
  } catch (error) {
    console.log(error)
  }
})

router.get('/', auth, async(req, res) => {

  const user = await User.findById(req.user._id)
  if (user.role === 'client') {
    const user = await req.user
    .populate('card.items.ticketId')
    .execPopulate()

    console.log("USER CARD---->", user.card)

    // Елсли абонемента больше не существует, то он удаляется из корзины
    user.card.items.forEach(async el => {
      const isTicketExist = await Ticket.findById(el.ticketId)

      // Удаляем абонемент из корзины
      if (!isTicketExist) {
        let cardItemsArr = user.card.items.filter(e => {
          return  e.ticketId !== el.ticketId
        })

        user.card.items = cardItemsArr
        user.save()
      }
    })

    const tickets = mapCardItems(user.card)

    res.render('card', {
      title: 'Корзина',
      style: 'card/card.css',
      isCard: true,
      tickets: tickets,
      price: computePrice(tickets)
    })
    
  } else {
    res.status(404)
    res.redirect('/404')
  }


})

module.exports = router