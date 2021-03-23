module.exports = function (req, res, next) {
  res.status(404).render('404', {
    style: '/404/404.css',
    title: 'Страница не найдена'
  })
}