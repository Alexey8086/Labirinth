const {Schema, model} = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String, 
    require: true
  },
  name: {
    type: String,
    required: true
  },
  card: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        ticketId: {
          type: Schema.Types.ObjectId,
          ref: 'Ticket',
          required: true
        }
      }
    ]
  }
})

userSchema.methods.addToCard = function(ticket) {
  // клонирование массива items из поля card из userSchema
  const items = [...this.card.items]
  const idx = items.findIndex(item => {
    return item.ticketId.toString() === ticket._id.toString()
  })

  if (idx >= 0) {
    items[idx].count = items[idx].count + 1
  } else {
    items.push({
      ticketId: ticket._id,
      count: 1
    })
  }

  // обновление содержимого корзины
  // (ключ и значение совпадают, поэтому вместо записи {items: items} пишем просто {items})
  this.card = {items}

  // возвращаем результат сохранения обновленного состояния корзины
  return this.save()
}

module.exports = model('User', userSchema)