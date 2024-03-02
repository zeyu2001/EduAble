const getQuizByNoteId = async (id) => {
  const res = await fetch(`/api/notes/${id}/quiz`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (res.status === 401) {
    return -1 // Not logged in
  }

  if (res.status !== 200) {
    withReactContent(Swal).fire({
      icon: "error",
      title: "Error",
      text: 'Something went wrong. Please try again later.'
    })
    return
  }

  const data = await res.json()
  return JSON.parse(data.quiz)
}

export { getQuizByNoteId }