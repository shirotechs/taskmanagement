import { useEffect, useState } from 'react'
import type { SearchCondition, Task, TaskInput } from '../types.ts'

// 検索条件に応じて GET /api/tasks を呼び、結果・読み込み状態・エラーを返す
export function useTaskSearch({ keyword, status, priority }: SearchCondition, reloadKey = 0) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        return res.json() as Promise<Task[]>
      })
      .then((data) => {
        setTasks(data)
        setError(null)
        setLoading(false)
      })
      .catch((e: Error) => {
        if (e.name === 'AbortError') return
        setError(e.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [keyword, status, priority, reloadKey])

  return { tasks, loading, error }
}

// POST /api/tasks で新規登録する。空欄の項目は送らない(BE側で未指定扱い)
export async function createTask(input: TaskInput): Promise<Task> {
  const body = {
    title: input.title.trim(),
    description: input.description || null,
    priority: input.priority || null,
    dueDate: input.dueDate || null,
  }
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`登録に失敗しました (HTTP ${res.status})`)
  return res.json() as Promise<Task>
}
