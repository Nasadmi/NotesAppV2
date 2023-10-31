const time = document.querySelectorAll('span.time')

time.forEach(span => {
  const data = span.textContent.split('GMT')[0]
  span.textContent = data
})

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timerProgressBar: true,
  color: 'var(--color-1)',
  background: 'var(--color-4)'
})

const deleteBtn = document.querySelectorAll('button.btn-note.delete')

deleteBtn.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault()
    const uuid = button.getAttribute('data-uuid-note')
    Swal.fire({
      title: 'Are you secure for delete this note?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      background: 'var(--color-4)',
      color: 'var(--color-1)'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/notes/delete/${uuid}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            return Toast.fire({
              icon: 'error',
              title: 'Something went wrong',
              timer: 3000,
              timerProgressBar: true
            })
          }

          const res = response.json()

          if (res.err) {
            return Toast.fire({
              icon: 'error',
              title: 'The note cannot be delete',
              timer: 3000,
              timerProgressBar: true
            })
          }

          Toast.fire({
            icon: 'success',
            title: 'The note has been delete',
            timer: 1500
          }).then(() => {
            button.parentElement.classList.add('hidden')
          })
        } catch (err) {
          console.error(err)
        }
      } else {
        return
      }
    })
  })
})

const logOutBtn = document.querySelector('button#logOutAction')

logOutBtn.addEventListener('click', (e) => {
  e.preventDefault()
  Swal.fire({
    title: 'Are you secure for log out?',
    icon: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    background: 'var(--color-4)',
    color: 'var(--color-1)'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/profile/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          return Toast.fire({
            icon: 'error',
            title: 'Something went wrong',
            timer: 3000,
            timerProgressBar: true
          })
        }

        const res = response.json()

        if (res.err) {
          return Toast.fire({
            icon: 'error',
            title: 'Something went wrong in logout',
            timer: 3000,
            timerProgressBar: true
          })
        }

        window.location.href = '/'
      } catch (err) {
        console.error(err)
      }
    } else {
      return
    }
  })
})

const addNote = document.querySelector('button#addNoteAction')

addNote.addEventListener('click', (e) => {
  e.preventDefault()
  Swal.fire({
    title: 'Add note',
    showConfirmButton: true,
    showCancelButton: true,
    background: 'var(--color-4)',
    color: 'var(--color-1)',
    html:
      `
      <div class="add">
        <label for="title">
          <h3>Title (max. 50)</h3>
          <input type="text" name="title" id="title" autocomplete="off" spellcheck="false" maxlength="50" placeholder="Title">
        </label>
        <label for="content">
          <h3>Content (max. 500)</h3>
          <textarea name="content" id="content" maxlength="500" placeholder="Content" autcomplete="off"></textarea>
        </label>
      </div>
    `
  }).then(async (result) => {
    if (result.isConfirmed) {
      const title = document.querySelector('.add input#title').value
      const content = document.querySelector('.add textarea#content').value
      if (title.length === 0) {
        return Toast.fire({
          icon: 'info',
          title: 'The title should have any character',
          timer: 3000,
          timerProgressBar: true
        })
      }
      const data = {
        title: title,
        content: content
      }
      try {
        const response = await fetch(`/api/note/add`, {
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
            timer: 3000,
            timerProgressBar: true
          })
        }

        const res = response.json()

        if (res.err) {
          return Toast.fire({
            icon: 'error',
            title: 'Cannot be add the note',
            timer: 3000,
            timerProgressBar: true
          })
        }

        window.location.reload()
      } catch (err) {
        console.error(err)
      }
    } else {
      return
    }
  })
})