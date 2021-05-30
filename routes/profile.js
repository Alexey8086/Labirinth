const {Router} = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = Router()
const mod = require('../utils/mod')

router.get('/', auth, async (req, res) => {
  const IsAdmin = await mod.userIsAdmin(req.user._id, User)

  if (!IsAdmin) {
    try {
      const user = await User.findById(req.user._id)
      var userRole = user.role
    } catch (e) {
      console.log(e)
    }

    res.render('profile', {
      style: 'profile/profile.css',
      title: 'Профиль',
      isLogin: true,
      userRole: userRole,
      user: req.user.toObject()
    })
  } else {
    res.redirect('/adminPanel')
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const toChange = {
      name: req.body.name
    }

    if (req.file) {
      toChange.avatarUrl = req.file.path
    }

    Object.assign(user, toChange)
    await user.save()
    res.redirect('/profile')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router