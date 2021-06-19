const keys = require('../keys')


module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Аккаунт успешно создан!',
    text: 'and easy to do anywhere, even with Node.js',
    html: `
      <h1>Добро пожаловать в FITNESS-ЦЕНТР "ЛАБИРИНТ"!</h1>
      <p>Аккаунт был успешно создан c email - ${email}!</p>
      <hr/>
      <a href="${keys.BASE_URL}"><span style="color: pink;">FITNESS-ЦЕНТР</span> "ЛАБИРИНТ"</a>
    `
  }
}