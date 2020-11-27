import MenuToggler from './plugins/menu-toggler'
import slider from './plugins/slider'
import './plugins/modal'
import $ from './plugins/modal'
import googleMap from './plugins/google-map'
import cardRemove from './plugins/card-remove'
import toCurrency from './plugins/toCurrency'

import firebase from './firebase/firebase'
const container = document.querySelector('.slider-container')

MenuToggler()

slider()

if (container) {
  const Buttons = document.getElementsByClassName('item__button')

  const initModal = async (number) => {
    const db = firebase.firestore()
    const DATA = await db.collection('data').get()
    const data = DATA.docs.map(doc => doc.data())
    console.log(data)
    const Modal = $.modal({
      data: data[number],
      width: '200px'
    })

    return Modal
  }

  const initListeners = async () => {
    const Modal_1 = await initModal(0)
    const Modal_2 = await initModal(1)
    const Modal_3 = await initModal(2)
    const Modal_4 = await initModal(3)
    const Modal_5 = await initModal(4)
    const Modal_6 = await initModal(5)
    const Modal_7 = await initModal(6)


    Buttons[0].addEventListener('click', () => {
      Modal_1.open()
    })
    
    Buttons[1].addEventListener('click', () => {
      Modal_2.open()
    })

    Buttons[2].addEventListener('click', () => {
      Modal_3.open()
    })
    
    Buttons[3].addEventListener('click', () => {
      Modal_4.open()
    })

    Buttons[4].addEventListener('click', () => {
      Modal_5.open()
    })
    
    Buttons[5].addEventListener('click', () => {
      Modal_6.open()
    })

    Buttons[6].addEventListener('click', () => {
      Modal_7.open()
    })
  }

  initListeners()
}

googleMap()

cardRemove(document.querySelector('#card'))


if (!document.getElementById('price')) {
  document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
  })
}

if (document.getElementById('price')) {
  let price_input = document.getElementById('price')

  price_input.value = toCurrency(price_input.value)
}