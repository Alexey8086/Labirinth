const {Router} = require('express')
const Order = require('../models/order')
const router = Router()

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({
      'user.userId': req.user._id
    }).populate('user.userId')

    res.render('orders', {
      style: '/orders/orders.css',
      isOrder: true,
      title: 'Заказы',
      orders: orders.map(o => {
        return {
          ...o._doc,
          price: o.tickets.reduce((total, t) => {
            return total += t.count * t.ticket.price
          }, 0)
        }
      })
  
    })

  } catch (error) {
    console.log(error)
  }
})

router.post('/', async (req, res) => {
  try {
    const user = await req.user
      .populate('card.items.ticketId')
      .execPopulate()

    const tickets = user.card.items.map(i => ({
      count: i.count,
      ticket: {...i.ticketId._doc}
    }))

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      tickets: tickets
    })

    await order.save()
    await req.user.clearCard()

    res.redirect('/orders')

  } catch (error) {
    console.log(error)
  }
})

module.exports = router