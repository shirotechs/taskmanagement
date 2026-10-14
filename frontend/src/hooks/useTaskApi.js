import { useEffect, useState } from 'react'

// 検索条件に応じて GET /api/tasks を呼び、結果・読み込み状態・エラーを返す
export function useTaskSearch({ keyword, status, priority }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (status) params.set('status', status)
    if (priority) params.set('priority', priority)

    setLoading(true)
    fetch(`/api/tasks?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`APIエラー (HTTP ${res.status})`)
        return res.json()
      })
      .then((data) => {
        setTasks(data)
        setError(null)
        setLoading(false)
      })
      .catch((e) => {
        if (e.name === 'AbortError') return
        setError(e.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [keyword, status, priority])

  return { tasks, loading, error }
}
