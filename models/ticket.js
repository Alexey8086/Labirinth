const {Schema, model} = require('mongoose')

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  option1: {
    type: String,
    required: true
  },
  option2: {
    type: String,
    required: true
  },
  option3: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 1
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

ticketSchema.method('toClient', function() {
  const ticket = this.toObject()

  ticket.id = ticket._id
  delete ticket._id

  return ticket
})

module.exports = model('Ticket', ticketSchema)