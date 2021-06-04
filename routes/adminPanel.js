const {Router} = require('express')
const router = Router()
const Ticket = require('../models/ticket')
const Order = require('../models/order')
const User = require('../models/user')
const auth = require('../middleware/auth')
const mod = require('../utils/mod')

// // Функция, проверяющая является ли текущий пользователь админом
// async function userIsAdmin(userId) {
//   try {
//     const user = await User.findById(userId)
//     if (user.role === "admin") return user.role
//     else return null
//   } catch (e) {
//     console.log(e)
//   }
// }

const orderMonthsDuration = (tickets) => {
  let orderDuration = 0

  tickets.forEach(el=> {
    let count = el.count
    orderDuration += el.ticket.duration * count
  })

  return orderDuration
}

router.get('/', auth, async (req, res) => {

  const IsAdmin = await mod.userIsAdmin(req.user._id, User)

  if (IsAdmin) {

  mod.deleteExpiredOrder(Order)

  try {
    // Получение списка всех абонементов
    const tickets = await Ticket.find()
    .lean()
    .populate('userId', 'email name')

    const users = await User.find().lean()
    
    const orders = await Order.find().populate('user.userId')
  
    let ordersData = orders.map(o => {
      return {
        ...o._doc,
        price: o.tickets.reduce((total, t) => {
          return total += t.count * t.ticket.price
        }, 0)
      }
    })

    // Передача параметров в метод отрисовки страницы абонементы
    res.render('adminPanel', {
      style: '/adminPanel/adminPanel.css',
      title: 'Панель администратора',
      isAdminPanel: true,
      tickets,
      orders: ordersData,
      users,
      ticketsLenght: tickets.length,
      usersLenght: users.length,
      ordersLenght: orders.length
    })

  } catch (error) {
    console.log(error)
  }

  } else {
    res.redirect('/profile')
  }
})

// API
router.get('/users-data', auth, async (req, res) => {

  async function fillDataArray (array) {
    for (const el of array) {
      orders = await Order.find({ 'user.userId': el._id }).populate('user.userId')

      arr.push({
        name: el.name,
        email: el.email,
        role: el.role,
        ordersAmount: orders.length ? orders.length : 0
      })
    }
  }

  try {
    var arr = []
    const users = await User.find().lean()
    var orders = []

    await fillDataArray(users)
    res.status(200).json(arr)

  } catch (error) {
    console.log(error)
  }
})

// подтверждение заказа
router.post('/confirm-order', auth, async (req, res) => {

  const IsAdmin = await mod.userIsAdmin(req.user._id, User)

  if (IsAdmin) {

    try {
      const {id} = req.body
      delete req.body.id

      const order = await Order.findById(id)
      const days = orderMonthsDuration(order.tickets) * 30
      let expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + days)

      Order.findByIdAndUpdate(id, {"confirmed": true, "expirationDate": expirationDate }, (err, result) => {
        if (err){
          console.log(err);
        }
      })

    } catch (error) {
      console.log(error)
    }

    res.redirect('/adminPanel')
  } else {
    res.redirect('/profile')
  }
})

// // обновление редактируемой статьи в бд
// router.post('/edit', auth, async (req, res) => {

//   // console.log("request BODY: ", req.body)

//   try {
//     const {id} = req.body
//     delete req.body.id
//     const note = await Note.findById(id)
//     let isAdmin = await userIsWriter(req.session.user._id)

//     if (!isAdmin) {
//       return res.redirect('/articles')
//     }

//     Object.assign(note, req.body)
//     await note.save()
//   } catch (error) {
//     console.log(error)
//   }

//   res.redirect('/articles')
// })

// // удаление статьи из бд
// router.post('/remove', auth, async (req, res) => {
//   const {id} = req.body

//   try {
//     // Если пользователь не является редактором,
//     // то он не сможет удалить статью
//     let isWriter = await userIsWriter(req.session.user._id)
//     if (!isWriter) {
//       return res.redirect('/articles')
//     }

//     await Note.deleteOne({
//       _id: id,
//       userId: req.session.user._id
//     })
//   } catch (error) {
//     console.log(error)
//   }

//   res.redirect('/articles')
// })

module.exports = router