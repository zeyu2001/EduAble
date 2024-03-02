import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Link from 'next/link'

const getNotes = async () => {
  const res = await fetch('/api/notes', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (res.status === 401) {
    return -1
  }

  const data = await res.json()
  return data
}

const saveNote = async (title, content, noteId) => {
  
  let apiPath = '/api/notes'
  if (noteId && noteId !== 'data-new-note') {
    apiPath += `/${noteId}`
  }

  const res = await fetch(apiPath, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      title,
      content,
    }),
  })

  if (res.status === 401) {
    withReactContent(Swal).fire({
      icon: "info",
      title: "Sign in to continue",
      text: "You need to sign in to save notes",
      showConfirmButton: false,
      footer: <div>
        <ul className="container mx-auto flex justify-between items-center">
          <li>
            <Link href="/login">
              <p className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign in</p>
            </Link>
          </li>
          <li>
            <Link href="/register">
              <p className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign up</p>
            </Link>
          </li>
        </ul>
      </div>
    })
    return
  }

  const data = await res.json()
  if (data.error) {
    withReactContent(Swal).fire({
      icon: "error",
      title: "Error",
      text: data.error,
    })
  }
}

const updateNote = (id, title, content) => {
  fetch(`/api/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      title,
      content,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        withReactContent(Swal).fire({
          icon: "error",
          title: "Error",
          text: data.error,
        })
      }
    })
}

export { getNotes, saveNote, updateNote };