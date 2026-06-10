import { useEffect, useState } from 'react'
import { fetchList } from '../services/api'

export function useFetch(resource, params = {}, fallback = []) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchList(resource, params)
      .then((res) => {
        if (active) {
          setData(res.data?.length ? res.data : fallback)
          setError(null)
        }
      })
      .catch(() => {
        if (active) {
          setData(fallback)
          setError('Using offline data')
        }
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [resource, JSON.stringify(params)])

  return { data, loading, error }
}
