// Импорт объекта "body" из библиотеки express-validator для валидации отправленных данных
const {body, check} = require('express-validator')
const userShema = require('../models/user')

// Текст сообщения ошибок при проверки валидатором поля
const emailMsg = 'Введён некорректный email!'
const passwordMsg = 'Пароль должен содержать от 8 до 40 символов, включая буквы (только латинского алфавита в верхнем и нижнем регистре), цифры и символ (один или более)!'
const nameMsg = 'Имя должно состоять минимум из 3 символов (но не более чем из 20)'
const duplicationEmailMsg = 'Пользователь с таким email уже существует!'

const titleMsg = 'Длина заголовка должна быть не меннее 3 и неболее 35 символов!'
const priceMsg = 'Введено некорректное значение цены!'
const optionMsg = 'Значение опции должно состоять не менее чем из 4 и не более чем из 45 символов!'
const descriptionMsg = 'Описание абонемента должно содержать от 4 из 350 символов!'
const ticketsAmountMsg = 'Введено некорректное значение количества абонементов!'
// const durationMsg = 'Продолжительность абонемента должно быть целым неотрицательным числом!'

// Экспорт модуля валидаторов
module.exports.registerValidators = [
  // Валидация и проверка на существование email в системе
  body('email', emailMsg)
    .isEmail()
    .custom( async (value, {req}) => {
      try {
        const user = await userShema.findOne({email: value.toLowerCase()})
        if (user) {
          return Promise.reject(duplicationEmailMsg)
        }
      } catch (e) {
        console.log(e)
      }
  })
  .normalizeEmail(),

  // Валидация пароля на устойчивость
  body('password', passwordMsg)
    .isStrongPassword({maxLength: 40})
    .trim(),

  // Сравнение значений введённых в поле "пароль" и в поле "повторите пароль"
  body('confirm')
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error('Пароли не совпадают!')
      }
      return true
  })
  .trim(),

  // Валидация имени на минимальную длину
  body('name', nameMsg).isLength({min: 3, max: 20}).trim()
]

module.exports.ticketValidators = [
  body('title', titleMsg).isLength({min: 3, max: 35}),
  body('price', priceMsg).isNumeric().isLength({min: 1, max: 7}),
  body('option1', optionMsg).isLength({min: 4, max: 45}),
  body('option2', optionMsg).isLength({min: 4, max: 45}),
  body('option3', optionMsg).isLength({min: 4, max: 45}),
  body('description', descriptionMsg).isLength({min: 4, max: 350}),
  body('ticketsAmount', ticketsAmountMsg).isNumeric().isLength({min: 1, max: 7})
  // body('duration', durationMsg).isNumeric()
]