module.exports = function (req, res, next) {
  res.locals.isAuth = req.session.isAuthenticated
  res.locals.surf = req.csrfToken()
  next()
}