const {Router} = require('express')
const Ticket = require('../models/ticket')
const User = require('../models/user')
const KEYS = require('../keys')
  //middleware, который закрывает доступ к странице для неавторизованных пользователей
const auth = require('../middleware/auth')
const normalizePrice = require('../middleware/normalizePrice')
const router = Router()
const {validationResult} = require('express-validator')
const {ticketValidators} = require('../utils/validators')

// Функция, проверяющая является ли текущий пользователь админом
async function userIsAdmin(userId) {
  try {
    const user = await User.findById(userId)
    if (user.role === "admin") return user.role
    else return null
  } catch (e) {
    console.log(e)
  }
}

// страница абонементов
router.get('/', async (req, res) => {

  // ID пользователя, если он авторизовался
  const USER_ID = req.user ? req.user._id.toString() : null

  try {
    // Получение списка всех абонементов
    const tickets = await Ticket.find()
    .lean()
    .populate('userId', 'email name')

    const user = await User.findById(USER_ID)

    // Передача параметров в метод отрисовки страницы абонементы
    res.render('tickets', {
      style: '/tickets/tickets.css',
      title: 'Абонементы',
      isTickets: true,
      userRole: user ? user.role : null,
      tickets
    })

  } catch (error) {
    console.log(error)
  }
})

// страница редактирования абонемента
router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  try {
    const ticket = await Ticket.findById(req.params.id).lean()
    const idCurrentUser = req.session.user._id
    // Если пользователь не является администратором,
    // то страница редактирования абонемента не откроется
    let isAdmin = await userIsAdmin(idCurrentUser)
    if (!isAdmin) {
      return res.redirect('/tickets')
    }

    res.render('ticket-edit', {
      style: '/add/add.css',
      title: `Редактировать ${ticket.title}`,
      ticket,
      editFormError: req.flash('editFormError')
    })

  } catch (error) {
    console.log(error)
  }
})

// обновление редактируемого абонемента в бд
router.post('/edit', auth, normalizePrice, ticketValidators, async (req, res) => {

  const errors = validationResult(req)

  // Обработка ошибок пользовательского ввода
  if (!errors.isEmpty()) {
    req.flash('editFormError', errors.array()[0].msg)
    return res.status(422).redirect(`/tickets/${req.body.id}/edit?allow=true`)
  }

  try {
    const {id} = req.body
    delete req.body.id
    const ticket = await Ticket.findById(id)
    let isAdmin = await userIsAdmin(req.session.user._id)

    if (!isAdmin) {
      return res.redirect('/tickets')
    }

    // приведение цены из клиентской формы к валидному виду
    // req.body.price = parseInt(req.body.price.replace(/\s+/g, ''))

    Object.assign(ticket, req.body)
    await ticket.save()
    res.redirect('/tickets')

  } catch (error) {
    console.log(error)
  }

})

// удаление редактируемого абонемента в бд
router.post('/remove', auth, async (req, res) => {
  const {id} = req.body

  try {
    // Если пользователь не является администратором,
    // то он не сможет удалить абонемент
    let isAdmin = await userIsAdmin(req.user._id.toString())
    if (!isAdmin) {
      return res.redirect('/tickets')
    }

    await Ticket.deleteOne({
      _id: id,
      userId: KEYS.ADMIN_ID
    })
    res.redirect('/tickets')
  } catch (error) {
    console.log(error)
  }
})

// страница абонемента
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).lean()
    res.render('ticket', {
      layout: 'empty',
      title: `Абонемент ${ticket.title}`,
      ticket
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router