module.exports = function (req, res, next) {
    // приведение цены из клиентской формы к валидному виду
    req.body.price = parseInt(req.body.price.replace(/\s+/g, ''))

  next()
}