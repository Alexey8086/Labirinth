import MenuToggler from './plugins/menu-toggler'
import slider from './plugins/slider'
import './plugins/modal'
import $ from './plugins/modal'
import { Map } from './plugins/google-map'
import cardRemove from './plugins/card-remove'
import toCurrency from './plugins/toCurrency'
import dateFormat from './plugins/dateFormat'

import firebase from './firebase/firebase'

import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import Paragraph from '@editorjs/paragraph'
import getParams from './plugins/getParams'

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
      width: '350px'
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

if (document.querySelector('#map')) {

  document.addEventListener("DOMContentLoaded", async function() {
    let mapElement = document.getElementById('map');
    const csrf = document.getElementById('index_csrf').value ? document.getElementById('index_csrf').value : ''
    const queryObj = {apiClient: 'google-map'}

    var api_key = await fetch('/api/keys', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrf
      },
      body: JSON.stringify(queryObj)
    })

    api_key = await api_key.json()

    Map.loadGoogleMapsApi(api_key).then(function(googleMaps) {
      const map = Map.createMap(googleMaps, mapElement)
      Map.createMarker(googleMaps, map)
      
    })
  })

}

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

// форматирование даты
if (document.querySelectorAll('.date')) {
  document.querySelectorAll('.date')
    .forEach(node => {
      node.textContent = dateFormat(node.textContent)
    })
}

// EDITOR JS -------------------------------------
if (document.getElementById('editorjs')) {
  
  async function tempFunc (resolve, reject) {
    const id = getParams('id', window.location.href)
  
    try {
      if (id) {
        let data = await fetch('/editor/toClient/' + id, {
          method: 'get',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
        })
    
        data = await data.json()
    
        delete data._id
    
    
        resolve(data)
      } else {
        resolve(false)
      }
  
  
    } catch (error) {
      reject(error)
    }
  }
  
  function editorConfig (DATA) {
    if (DATA) {
      return new EditorJS({
  
        holder: 'editorjs',
      
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [2, 3, 4],
              defaultLevel: 3
            }
          },
      
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          }
        },
      
        data: {
          ...DATA
        }
      
      })
    } 
    else {
      return new EditorJS({
  
        holder: 'editorjs',
      
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [2, 3, 4],
              defaultLevel: 3
            }
          },
      
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          }
        },
  
        data: {}
      })
    }
  }
  
  const getData = new Promise((resolve, reject) => {
    tempFunc(resolve, reject)
  })
  
  getData.then(DATA =>  {
    return editorConfig(DATA)
  }).then(editor => {
    console.log("EDITOR INSIDE", editor);
    editor.isReady.then(() => {
  
      var csrf = document.getElementById('editor-surf-input').value
      const saveBtn = document.getElementById('editor_save_btn')
      const deleteBtn = document.getElementById('editor_delete_btn')

      if (saveBtn) {
        saveBtn.addEventListener('click', async function saveCallback () {
          const savedDATA = await editor.save()
          const URL = getParams('id', window.location.href) ? '/editor/edit' : '/editor'
          const noteId = getParams('id', window.location.href)
          savedDATA.id = noteId

            const response = await fetch(URL, {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': csrf
              },
              body: JSON.stringify(savedDATA)
            })

            console.log("data saved --CUSTOM")

          saveBtn.removeEventListener('click', saveCallback)
      
          document.location.href = '/articles'
        })
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', async function saveCallback () {
          const noteId = getParams('id', window.location.href)
          const id = {id: noteId}

          const response = await fetch('/editor/remove', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'Accept': 'application/json',
              'X-XSRF-TOKEN': csrf
            },
            body: JSON.stringify(id)
          })

          console.log("note deleted --CUSTOM")
      
          console.log("Click!");
          deleteBtn.removeEventListener('click', saveCallback)
      
          document.location.href = '/articles'
        })
      }

    }).catch((reason) => {
      console.log(`Editor.js initialization failed because of ${reason}`)
    })
  
  })

}