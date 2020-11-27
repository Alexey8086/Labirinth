let position = 0
let slidesToShow = 6
const slidesToScroll = 1
const track = document.querySelector('.slider-track')
const btnPrev = document.querySelector('.btn-prev')
const btnNext = document.querySelector('.btn-next')
const items = document.querySelectorAll('.slider-item')
const itemsCount = items.length
const container = document.querySelector('.slider-container')

if (container) {

  if (window.matchMedia("(max-width: 992px)").matches) {
    slidesToShow = 3
  }

  // if (window.matchMedia("(max-width: 768px)").matches) {
  //   slidesToShow = 3
  // }

  if (window.matchMedia("(max-width: 576px)").matches) {
    slidesToShow = 1
  }

  var itemWidth = container.clientWidth / slidesToShow
  var movePosition = slidesToScroll * itemWidth
}

const slider = () => {
  if (container) {
    items.forEach((item) => {
      item.style.minWidth = `${itemWidth}px`
    })
    
    btnNext.addEventListener('click', () => {
      const itemsLeft = itemsCount - (Math.abs(position) + slidesToShow * itemWidth) / itemWidth
    
      position -= itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth
    
      setPosition()
      checkBtns()
    })
    
    btnPrev.addEventListener('click', () => {
      const itemsLeft = Math.abs(position) / itemWidth
    
      position += itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth
    
      setPosition()
      checkBtns()
    })
    
    const setPosition = () => {
      track.style.transform = `translateX(${position}px)`
    }
    
    const checkBtns = () => {
      btnPrev.disabled = position === 0
      btnNext.disabled = position <= -(itemsCount - slidesToShow) * itemWidth
    }
  
    checkBtns()
  }
}

export default slider
