const {Router} = require('express')
const User = require('../models/user')
const Note = require('../models/editor_schema')
const router = Router()
const sanitizeHtml = require('sanitize-html');

const clean = (dirty) => {
  return sanitizeHtml(dirty, {
    allowedTags: [],
    allowedAttributes: {}
  });
}

const kitCut = (text) => {
  text = clean(text)
  textLength = text.length
  text = text.slice(0, 50);
  if (text.length < textLength) {
    text += '...';
  }

  return text
}

const normalizeDate = (date) => {
  return new Intl.DateTimeFormat('ru-Ru', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Функция, проверяющая является ли текущий пользователь админом
async function userRole(userId) {
  try {
    const user = await User.findById(userId)
    return user.role
  } catch (e) {
    console.log(e)
  }
}

// страница статей
router.get('/', async (req, res) => {

  try {
    const notes = await Note.find().lean()
    const Articles = []

    notes.forEach(el => {
      Articles.push({
        title: clean(el.blocks[0].data.text),
        text: el.blocks[1] ? kitCut(el.blocks[1].data.text) : null,
        id: el._id,
        date: normalizeDate(new Date(el.time))
      })
    })

    res.render('articles', {
      style: '/articles/articles.css',
      title: 'Главная',
      isArticles: true,
      Articles
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router