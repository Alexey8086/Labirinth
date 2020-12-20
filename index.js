const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const db_username = 'All-exe'
const db_password = 'h0ouIA*L'
const db_name = 'gym'
const db_url = `mongodb+srv://${db_username}:${db_password}@cluster0.jgzhb.gcp.mongodb.net/${db_name}`

const coverRoutes = require('./routes/cover')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const ticketsRoutes = require('./routes/tickets')
const aboutRoutes = require('./routes/about')
const userAuthRoutes = require('./routes/user-auth')
const ordersRoutes = require('./routes/orders')
const PORT = process.env.PORT || 8000

// Подключение модели пользователя
const userSchema = require('./models/user')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(async (req, res, next) => {
  try {
    const user = await userSchema.findById('5fda0563d8cca61eb476b5c8')
    req.user = user
    next()
  } catch (error) {
    console.log(error)
  }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', coverRoutes)
app.use('/add', addRoutes)
app.use('/tickets', ticketsRoutes)
app.use('/about', aboutRoutes)
app.use('/user-auth', userAuthRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)

async function start () {
  try {
    await mongoose.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })

    const candidate = await userSchema.findOne()
    if (!candidate) {
      const user = new userSchema({
        email: 'test@gmail.ru',
        name: 'Alexey',
        card: {items: []}
      })

      await user.save()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()