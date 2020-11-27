const {Router} = require('express')
const Ticket = require('../models/ticket')
const router = Router()

router.get('/', async (req, res) => {
  const tickets = await Ticket.getAll()
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

  const ticket = await Ticket.getById(req.params.id)

  res.render('ticket-edit', {
    style: '/add/add.css',
    title: `Редактировать ${ticket.title}`,
    ticket
  })
})

router.post('/edit', async (req, res) => {
  await Ticket.update(req.body)
  res.redirect('/tickets')
})

router.get('/:id', async (req, res) => {
  const ticket = await Ticket.getById(req.params.id)
  res.render('course', {
    layout: 'empty',
    title: `Абонемент ${ticket.title}`,
    ticket
  })
})

module.exports = router