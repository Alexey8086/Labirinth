const path = require('path')
const fs = require('fs')
const { resolve } = require('path')
const { countReset } = require('console')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'card.json',
)

class Card {
  static async add (ticket) {
    const card = await Card.fetch()

    const idx = card.tickets.findIndex(c => c.id === ticket.id)
    const candidate = card.tickets[idx]

    if (candidate) {
      // абонемент уже есть
      candidate.count++
      card.tickets[idx] = candidate
    } else {
      // нужно добавить
      ticket.count = 1
      card.tickets.push(ticket)
    }

    card.price += +ticket.price

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  static async remove (id) {
    const card = await Card.fetch()
    
    const idx = card.tickets.findIndex(c => c.id === id)
    const ticket = card.tickets[idx]

    if (ticket.count === 1) {
      // удалить полностью айтем абонемента
      card.tickets = card.tickets.filter(c => c.id !== id)
    } else {
      // изменить количество
      card.tickets[idx].count--
    }

    card.price -= ticket.price

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), err => {
        if (err) {
          reject(err)
        } else {
          resolve(card)
        }
      })
    })
  }

  static async fetch () {
    return new Promise((resolve, reject) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(content))
        }
      })
    })
  }
}

module.exports = Card