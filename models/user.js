const {Schema, model} = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String, 
    require: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
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

// Добавление продукта в базу данных
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

// Удаление продукта из базы данных
userSchema.methods.removeFromCard = function (id) {
  let items = [...this.card.items]
  const idx = items.findIndex(i => {
    return i.ticketId.toString() === id.toString()
  })

  console.log("Log from user, Idx= ", idx)

  if (items[idx].count === 1) {
    items = items.filter(i => i.ticketId.toString() !== id.toString())
  } else {
    items[idx].count--
  }

  this.card = {items}
  return this.save()
}

// Очистка корзины после нажатия на кнопку "оформить заказ"
userSchema.methods.clearCard = function() {
  this.card = {items: []}
  return this.save()
}

module.exports = model('User', userSchema)