const express = require('express')
const path = require('path')
const surf = require('csurf')
const helmet = require('helmet')
const compression = require('compression')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const fileMiddleware = require('./middleware/file')
const KEYS = require('./keys')

const coverRoutes = require('./routes/cover')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const ticketsRoutes = require('./routes/tickets')
const aboutRoutes = require('./routes/about')
const authRoutes = require('./routes/auth')
const ordersRoutes = require('./routes/orders')
const profileRoutes = require('./routes/profile')
const editorRoutes = require('./routes/editor')
const articlesRoutes = require('./routes/articles')
const api_keysRoutes = require('./routes/api-keys')

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')

const PORT = process.env.PORT || 8000
const app = express()

const myHelpers = require('./utils/hbs-helpers')

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: myHelpers,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
})

const store = new MongoStore({
  collection: 'sessions',
  uri: KEYS.db_url
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(express.urlencoded({extended: false})) // было true

// конфигурация функции сессии, которая является middleware
app.use(session({
  secret: KEYS.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}))

app.use(fileMiddleware.single('avatar'))
app.use(surf())
app.use(flash())
// app.use(helmet())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', coverRoutes)
app.use('/add', addRoutes)
app.use('/tickets', ticketsRoutes)
app.use('/about', aboutRoutes)
app.use('/auth', authRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/profile', profileRoutes)
app.use('/articles', articlesRoutes)

app.use('/editor', editorRoutes)
app.use('/api', api_keysRoutes)

app.use(errorHandler)

async function start () {
  try {
    await mongoose.connect(KEYS.db_url, {
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