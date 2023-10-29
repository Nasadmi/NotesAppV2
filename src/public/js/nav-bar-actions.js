const changeThemeBtn = document.querySelector("#changeThemeAction")

const themeLink = document.querySelector("#themeLink")

let theme;

changeThemeBtn.addEventListener('click', () => {

  if (document.cookie === 'theme=dark') {
    theme = 'default'
  } else {
    theme = 'dark'
  }

  document.querySelectorAll('body *').forEach(element => {
    element.classList.add('transition-500')
  })
  
  themeLink.href = `/resources/css/${theme}.css`
  document.cookie = `theme=${theme}`

  setTimeout(() => {
    document.querySelectorAll('body *').forEach(element => {
      element.classList.remove('transition-500')
    })
  }, 1000)
})