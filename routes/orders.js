const {Router} = require('express')
const Order = require('../models/order')
const Ticket = require('../models/ticket')
  //middleware, который закрывает доступ к странице для неавторизованных пользователей
const auth = require('../middleware/auth')
const router = Router()
const mod = require('../utils/mod')

// mod.dateDiffInDays()

router.get('/', auth, async (req, res) => {
  mod.deleteExpiredOrder(Order)

  try {
    const today = new Date()

    const orders = await Order.find({
      'user.userId': req.user._id
    }).populate('user.userId')

    let ordersData = orders.map(o => {
      
      return {
        ...o._doc,
        price: o.tickets.reduce((total, t) => {
          return total += t.count * t.ticket.price
        }, 0),
        daysBeforeEndFreeze: mod.dateDiffInDays(today, o.freezeEndDate)
      }
    })


    res.render('orders', {
      style: 'orders/orders.css',
      isOrder: true,
      title: 'Заказы',
      orders: ordersData
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

router.post('/cancelOrder', auth, async (req, res) => {

  const {id} = req.body

  try {

    const order = await Order.findById(id)

    order.tickets.forEach(async el => {
      let ticketId = el.ticket._id
  
      const ticket = await Ticket.findById(ticketId)
      let ticketsAmount = ticket.ticketsAmount
      ticketsAmount += el.count
    
      Ticket.findByIdAndUpdate(ticketId, {"ticketsAmount": ticketsAmount}, (err, result) => {
        if (err) {console.log(err)}
      })
    })

    await Order.deleteOne({
      _id: id
    })
    res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }

})

router.post('/freezeOrder', auth, async (req, res) => {
  

  try {
    const {id} = req.body
    delete req.body.id

    const order = await Order.findById(id)

    if (!order.wasFrozen) {
      const expirationDate = order.expirationDate
      const freezeEndDate = new Date()
  
      freezeEndDate.setDate(freezeEndDate.getDate() + 30)
      expirationDate.setDate(expirationDate.getDate() + 30)
  
      console.log("ДАТА ОКОНЧАНИЯ ВСЕХ АБОНЕМЕНТОВ: ", expirationDate)
  
      Order.findByIdAndUpdate(id, {"wasFrozen": true, "freezeEndDate": freezeEndDate, "expirationDate": expirationDate}, (err, result) => {
        if (err){
          console.log(err);
        }
      })
  
      res.redirect('/orders')
    } else {
      res.redirect('/orders')
    }

  } catch (error) {
    console.log(error)
  }

})


module.exports = router