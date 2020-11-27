const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')

const coverRoutes = require('./routes/cover')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const ticketsRoutes = require('./routes/tickets')
const aboutRoutes = require('./routes/about')
const userAuthRoutes = require('./routes/user-auth')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', coverRoutes)
app.use('/add', addRoutes)
app.use('/tickets', ticketsRoutes)
app.use('/about', aboutRoutes)
app.use('/user-auth', userAuthRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})