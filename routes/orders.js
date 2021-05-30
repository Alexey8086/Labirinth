const {Router} = require('express')
const Order = require('../models/order')
  //middleware, который закрывает доступ к странице для неавторизованных пользователей
const auth = require('../middleware/auth')
const router = Router()
const mod = require('../utils/mod');

router.get('/', auth, async (req, res) => {
  mod.deleteExpiredOrder(Order)

  try {
    const orders = await Order.find({
      'user.userId': req.user._id
    }).populate('user.userId')

    let ordersData = orders.map(o => {
      
      return {
        ...o._doc,
        price: o.tickets.reduce((total, t) => {
          return total += t.count * t.ticket.price
        }, 0)
      }
    })

    res.render('orders', {
      style: 'orders/orders.css',
      isOrder: true,
      title: 'Заказы',
      orders: ordersData,
    })

  } catch (error) {
    console.log(error)
  }
})

router.post('/', auth, async (req, res) => {
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

router.post('/remove', auth, async (req, res) => {
  
  const {id} = req.body

  try {
    await Order.deleteOne({
      _id: id
    })
    res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }

})

module.exports = router