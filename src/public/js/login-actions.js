const inputs = document.querySelectorAll("label")

inputs.forEach(element => {
  element.children[1].addEventListener('focus', (e) => {
    e.preventDefault()
    element.children[0].classList.add('focus')
  })
  element.children[1].addEventListener('blur', (e) => {
    e.preventDefault()
    element.children[0].classList.remove('focus')
  })
})

const btnRegister = document.querySelector("#register-btn")

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timerProgressBar: true,
  color: 'var(--color-1)',
  background: 'var(--color-4)'
})

let waiting;

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const waitResponseAlert = () => {
  if (waiting) {
    Toast.fire({
      icon: 'info',
      title: 'Please wait response from server',
      timer: 3000
    })
  } else {
    return
  }
}

btnRegister.addEventListener('click', async () => {
  const data = {
    email: document.querySelector('input#email').value,
    password: document.querySelector('input#password').value,
  }

  if (data.email === '' || data.password === '') {
    return Toast.fire({
      icon: 'warning',
      title: 'Please complete all fields',
      timer: 3000
    })
  }

  if (!validateEmail(data.email)) {
    return Toast.fire({
      icon: 'error',
      title: 'Please enter a valid email',
      timer: 3000
    })
  }

  waiting = true

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      return Toast.fire({
        icon: 'error',
        title: 'Something went wrong',
        timer: 3000
      })
    }

    const res = await response.json()
    console.log(res)
    waiting = false

    if (res.err) {
      return Toast.fire({
        icon: 'error',
        title: 'Login Error',
        timer: 3000
      })
    }

    Toast.fire({
      icon: 'success',
      title: 'Welcome!',
      timer: 1500
    }).then(() => {
      window.location.href = '/dashboard'
    })
  } 

  catch (error) {
    console.error(error)
  }
})