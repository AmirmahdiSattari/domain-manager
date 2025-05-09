const BASE = 'https://6797aa2bc2c861de0c6d964c.mockapi.io/domain'

export const getAll = async () => {
  const res = await fetch(BASE)
  return res.json()
}

export const create = async (data) => {
  await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export const update = async (data) => {
  await fetch(`${BASE}/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export const remove = async (id) => {
  await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
  })
}
