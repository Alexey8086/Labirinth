const $ = {}

function _createModal (options) {
  const DEFAULT_WIDTH = '600px'
  const modal = document.createElement('div')
  modal.classList.add('vmodal')
  modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-overlay" data-close="true">
      <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
        <div class="modal-header">
          <span class="modal-title">${options.data.content.title || 'Заголовок отсутствует:('}</span>
          <span class="modal-close" data-close="true">&times;</span>
        </div>
        <div class="modal-body">
          <p>${options.data.content.text || 'Контент отсутствует:('}</p>
        </div>
        <div class="modal-footer">
          <button data-close="true">Закрыть</button>
        </div>
      </div>
    </div>
  `)

  document.body.appendChild(modal)
  return modal
}

$.modal = function (options) {
  const ANIMATION_SPEED = 200
  const $modal = _createModal(options)
  let closing = false
  let destroyed = false

  const modal = {
    open() {
      if (destroyed) {
        return console.log('Modal is destroyed');
      }
      !closing && $modal.classList.add('open')
    },
    close() {
      closing = true
      $modal.classList.remove('open')
      $modal.classList.add('hide')
      setTimeout(() => {
        $modal.classList.remove('hide')
        closing = false
      }, ANIMATION_SPEED)
    },
  }

  const listener = event => {
    if (event.target.dataset.close) {
      modal.close()
      // modal.destroy()
    }
  }

  $modal.addEventListener('click', listener)

  return Object.assign(modal, {
    destroy() {
      $modal.parentNode.removeChild($modal)
      $modal.removeEventListener('click', listener)
      destroyed = true
    }
  })
}

export default $