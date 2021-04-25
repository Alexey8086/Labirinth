const {Router} = require('express')
const User = require('../models/user')
const Note = require('../models/editor_schema')
  //middleware, который закрывает доступ к странице для неавторизованных пользователей
const auth = require('../middleware/auth')
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
        id: el._id
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