let menuOpenIcon = document.getElementById('navbar__menu-toggler')
let menuCloseIcon = document.getElementById('navbar__menu-close')
let smContainerSidebar = document.getElementById('sm-container-sidebar')
let isSlide = false // means menu is close

const MenuToggler = () => {
  menuOpenIcon.addEventListener('click', () => {
    if (!isSlide) {
      smContainerSidebar.style.left = 0
      isSlide = true

      // console.log('Sidebar is Open');
    }
  })
  
  menuCloseIcon.addEventListener('click', () => {
    if (isSlide) {

      if (window.matchMedia("(max-width: 576px)").matches) {
        smContainerSidebar.style.left = '-70vw'
      } else {
        smContainerSidebar.style.left = '-35vw'
      }

      // smContainerSidebar.style.left = '-35vw'
      isSlide = false

      // console.log('Sidebar is Close');
    }
  })
}

export default MenuToggler