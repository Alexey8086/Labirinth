const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

class Ticket {
  constructor(title, price, option1, option2, option3) {
    this.title = title
    this.price = price
    this.option1 = option1
    this.option2 = option2
    this.option3 = option3
    this.id = uuidv4()
  }

  toJSON() {
    return {
      title: this.title,
      price:  parseInt(this.price.replace(/\s+/g, '')),
      option1: this.option1,
      option2: this.option2,
      option3: this.option3,
      id: this.id
    }
  }

  static async update(ticket) {
    const tickets = await Ticket.getAll()

    const idx = tickets.findIndex(c => c.id === ticket.id)
    ticket.price = parseInt(ticket.price.replace(/\s+/g, ''))
    tickets[idx] = ticket

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'tickets.json'),
        JSON.stringify(tickets),
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  async save() {
    const tickets = await Ticket.getAll()
    tickets.push(this.toJSON())
    console.log('This from save method:', this)

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'tickets.json'),
        JSON.stringify(tickets),
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'tickets.json'),
        'utf-8',
        (err, content) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(content))
          }
        }
      )
    })
  }

  static async getById(id) {
    const tickets = await Ticket.getAll()
    return tickets.find(t => t.id === id)
  }
}

module.exports = Ticket