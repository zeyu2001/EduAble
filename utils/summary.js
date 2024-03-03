const getSummaryByNoteId = async (id, regenerate) => {
  const res = await fetch(`/api/notes/${id}/summarize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ regenerate })
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
  return data.summary
}

export { getSummaryByNoteId }