const {Router} = require('express')
const Ticket = require('../models/ticket')
const KEYS = require('../keys')
  //middleware, который закрывает доступ к странице для неавторизованных пользователей
const auth = require('../middleware/auth')
const router = Router()

function userIsAdmin(ticket, ADMIN_ID) {
  return ticket.userId.toString() === ADMIN_ID
}


router.get('/', async (req, res) => {

  const USER_ID = req.user ? req.user._id.toString() : null

  try {
    const tickets = await Ticket.find()
    .lean()
    .populate('userId', 'email name')

    res.render('tickets', {
      style: '/tickets/tickets.css',
      title: 'Абонементы',
      isTickets: true,
      userId: USER_ID,
      tickets
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  try {
    const ticket = await Ticket.findById(req.params.id).lean()

    // Если пользователь не является администратором,
    // то страница редактирования абонемента не откроется
    if (!userIsAdmin(ticket, KEYS.ADMIN_ID)) {
      return res.redirect('/tickets')
    }

    res.render('ticket-edit', {
      style: '/add/add.css',
      title: `Редактировать ${ticket.title}`,
      ticket
    })

  } catch (error) {
    console.log(error)
  }
})

// обновление редактируемого абонемента в бд
router.post('/edit', auth, async (req, res) => {

  try {
    const {id} = req.body
    delete req.body.id
    const ticket = await Ticket.findById(id)
    if (!userIsAdmin(ticket, KEYS.ADMIN_ID)) {
      return res.redirect('/tickets')
    }

    // приведение цены из клиентской формы к валидному виду
    req.body.price = parseInt(req.body.price.replace(/\s+/g, ''))

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
    if (req.user._id.toString() !== KEYS.ADMIN_ID) {
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