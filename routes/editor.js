const {Router} = require('express')
const router = Router()
const Note = require('../models/editor_schema')
const User = require('../models/user')
const auth = require('../middleware/auth')

// Функция, проверяющая является ли текущий пользователь админом
async function userIsWriter(userId) {
  try {
    const user = await User.findById(userId)
    if (user.role === "writer") return user.role
    else return null
  } catch (e) {
    console.log(e)
  }
}

// страница новости
router.get('/:id', auth, async (req, res) => {

  let isWriter = false
  let isDeletable = false

  isWriter = (req.session.user.role === 'writer') ? true : false
  if (req.query.id && isWriter) isDeletable = true

  res.render('editor', {
    style: '/editor/editor.css',
    title: 'Редактор',
    isWriter,
    isDeletable
  })
})

// страница создания новости
router.get('/', auth, async (req, res) => {
  let isWriter = false
  let isDeletable = false

  isWriter = (req.session.user.role === 'writer') ? true : false
  if (req.query.id && isWriter) isDeletable = true

  res.render('editor', {
    style: '/editor/editor.css',
    title: 'Редактор',
    isWriter,
    isDeletable
  })
})

// API
router.get('/toClient/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).lean()
    res.status(200).json(note)

  } catch (error) {
    console.log(error)
  }
})

// создание новой статьи в бд
router.post('/', auth, async (req, res) => {

  const note = new Note({
    time: req.body.time,
    blocks: req.body.blocks,
    version: req.body.version,
    userId: req.user._id
  })

  try {
    await note.save()
  } catch (error) {
    console.log(error)
  }

  res.redirect('/')
})

// обновление редактируемой статьи в бд
router.post('/edit', auth, async (req, res) => {

  // console.log("request BODY: ", req.body)

  try {
    const {id} = req.body
    delete req.body.id
    const note = await Note.findById(id)
    let isAdmin = await userIsWriter(req.session.user._id)

    if (!isAdmin) {
      return res.redirect('/articles')
    }

    Object.assign(note, req.body)
    await note.save()
  } catch (error) {
    console.log(error)
  }

  res.redirect('/articles')
})

// удаление статьи из бд
router.post('/remove', auth, async (req, res) => {
  const {id} = req.body

  try {
    // Если пользователь не является редактором,
    // то он не сможет удалить статью
    let isWriter = await userIsWriter(req.session.user._id)
    if (!isWriter) {
      return res.redirect('/articles')
    }

    await Note.deleteOne({
      _id: id,
      userId: req.session.user._id
    })
  } catch (error) {
    console.log(error)
  }

  res.redirect('/articles')
})

module.exports = router