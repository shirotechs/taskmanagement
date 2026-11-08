import { useState } from 'react'
import { createTask } from '../hooks/useTaskApi.ts'
import type { Priority, TaskInput } from '../types.ts'

const EMPTY: TaskInput = { title: '', description: '', priority: '', dueDate: '' }

// 新規タスクの入力フォーム。登録に成功したら onCreated を呼んで一覧の再取得を促す
export default function TaskForm({ onCreated }: { onCreated: () => void }) {
  const [input, setInput] = useState<TaskInput>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.title.trim()) {
      setError('タイトルを入力してください')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await createTask(input)
      setInput(EMPTY)
      onCreated()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <form className="task-form" onSubmit={submit}>
        <input
          type="text"
          placeholder="タイトル(必須)"
          value={input.title}
          onChange={(e) => setInput({ ...input, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="説明"
          value={input.description}
          onChange={(e) => setInput({ ...input, description: e.target.value })}
        />
        <select
          value={input.priority}
          onChange={(e) => setInput({ ...input, priority: e.target.value as Priority | '' })}
        >
          <option value="">優先度: 未設定</option>
          <option value="HIGH">高</option>
          <option value="MEDIUM">中</option>
          <option value="LOW">低</option>
        </select>
        <input
          type="date"
          value={input.dueDate}
          onChange={(e) => setInput({ ...input, dueDate: e.target.value })}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '追加'}
        </button>
      </form>
      {error && <p className="message error">{error}</p>}
    </>
  )
}
