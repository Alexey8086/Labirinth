import toCurrency from './toCurrency'

const cardRemove = ($card) => {
  if ($card) {
    $card.addEventListener('click', event => {
      if (event.target.classList.contains('sat-js-remove')) {
        var id = event.target.dataset.id
        var csrf = event.target.dataset.csrf
      }
      
      fetch('/card/remove/' + id, {
        method: 'delete',
        headers: {
          'X-XSRF-TOKEN': csrf
        }
      })
      .then(res => res.json())
      .then(card => {
        if (card.tickets.length) {
          const html = card.tickets.map(t => {
            return `
              <div class="item">
                <div style="width: 40%" class="item-of-inside">${t.title}</div>
                <div class="item-of-inside">${t.count}</div>
                <div class="item-of-inside price">${t.price}</div>
                <button class="item-delete-btn sat-js-remove" data-id="${t.id}" data-csrf="${csrf}">Удалить</button>
              </div>
            `
          }).join('')

          const allCardItems = document.querySelectorAll('.item')

          allCardItems.forEach((item) => {
            item.remove()
          })

          $card.querySelector('#sat-horizontal-line').insertAdjacentHTML('afterend', html)
          $card.querySelector('.finaly-card-price').innerHTML = toCurrency(card.price)
        } else {
          $card.innerHTML = `
            <div id="sat-card-container">
          
              <div id="sat-div-card-title">
                <h1 id="sat-card-title">Корзина</h1>
              </div>
        
              <p id="sat-card-is-empty" style="margin-top: 200px;">Корзина пуста</p>
            </div>`
        }
      })
    })
  }
}

export default cardRemove