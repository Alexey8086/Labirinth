const User = require('../models/user')

  // так как данные пользователя хранятся в объекте session, то
  // функции обращения в бд и в частности к схеме данных пользователя
  // недоступны. Поэтому требуется добавить модель пользователя
  // к глобальному объекту req (request)
  
module.exports = async function (req, res, next) {
  if (!req.session.user) {
    return next()
  }

  req.user = await User.findById(req.session.user._id)
  next()
}