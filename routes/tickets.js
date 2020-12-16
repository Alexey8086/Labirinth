const {Router} = require('express')
const Ticket = require('../models/ticket')
const router = Router()

router.get('/', async (req, res) => {
  const tickets = await Ticket.find()
    .lean()
    .populate('userId', 'email name')
  console.log(tickets)

  res.render('tickets', {
    style: '/tickets/tickets.css',
    title: 'Абонементы',
    isTickets: true,
    tickets
  })
})

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  const ticket = await Ticket.findById(req.params.id).lean()

  res.render('ticket-edit', {
    style: '/add/add.css',
    title: `Редактировать ${ticket.title}`,
    ticket
  })
})

// обновление редактируемого абонемента в бд
router.post('/edit', async (req, res) => {
  const {id} = req.body
  delete req.body.id
  // приведение цены из клиентской формы к валидному виду
  req.body.price = parseInt(req.body.price.replace(/\s+/g, ''))
  try {
    await Ticket.findByIdAndUpdate(id, req.body)
    res.redirect('/tickets')
  } catch (error) {
    console.log(error)
  }
})

// удаление редактируемого абонемента в бд
router.post('/remove', async (req, res) => {
  const {id} = req.body
  try {
    await Ticket.deleteOne({_id: id})
    res.redirect('/tickets')
  } catch (error) {
    console.log(error)
  }
})

router.get('/:id', async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).lean()
  res.render('course', {
    layout: 'empty',
    title: `Абонемент ${ticket.title}`,
    ticket
  })
})

module.exports = router