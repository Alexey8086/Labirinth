const keys = require('../keys')

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Восстановление доступа к аккаунту',
    text: 'and easy to do anywhere, even with Node.js',
    html: `
      <h1>Восстановление пароля к аккаунту с email - ${email}</h1>
      <p>Если вы не желаете сбросить текущий пароль, то проигнорируйте данное письмо!</p>
      <p>Иначе, для восстановления доступа и сброса пароля нажмите на ссылку ниже:</p>
      <p><a href="${keys.BASE_URL}/auth/password/${token}">ВОССТАНОВИТЬ ДОСТУП</a></p>
      <hr/>
      <a href="${keys.BASE_URL}"><span style="color: pink;">FITNESS-ЦЕНТР</span> "ЛАБИРИНТ"</a>
    `
  }
}