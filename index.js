const express = require('express')
const path = require('path')
const surf = require('csurf')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
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
const authRoutes = require('./routes/auth')
const ordersRoutes = require('./routes/orders')
const PORT = process.env.PORT || 8000
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
})

const store = new MongoStore({
  collection: 'sessions',
  uri: db_url
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

// конфигурация функции сессии, которая является middleware
app.use(session({
  secret: 'secret-value',
  resave: false,
  saveUninitialized: false,
  store: store
}))
app.use(surf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', coverRoutes)
app.use('/add', addRoutes)
app.use('/tickets', ticketsRoutes)
app.use('/about', aboutRoutes)
app.use('/auth', authRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)

async function start () {
  try {
    await mongoose.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()