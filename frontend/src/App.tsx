import { useState } from 'react'
import Board from './components/Board.tsx'
import SearchForm from './components/SearchForm.tsx'
import TaskForm from './components/TaskForm.tsx'
import { moveTask, updateTask, useTaskSearch } from './hooks/useTaskApi.ts'
import type { Priority, SearchCondition, Status, Task } from './types.ts'

const INITIAL_CONDITION: SearchCondition = { keyword: '', status: '', priority: '' }

export default function App() {
  const [condition, setCondition] = useState<SearchCondition>(INITIAL_CONDITION)
  const [reloadKey, setReloadKey] = useState(0)
  const { tasks, setTasks, loading, error } = useTaskSearch(condition, reloadKey)
  const [actionError, setActionError] = useState<string | null>(null)

  // 画面を先に更新(楽観的更新)し、APIの結果で失敗したら再取得して元に戻す
  const runAction = async (request: () => Promise<unknown>) => {
    setActionError(null)
    try {
      await request()
    } catch (e) {
      setActionError((e as Error).message)
      setReloadKey((k) => k + 1)
    }
  }

  const handleMove = (id: number, status: Status, beforeId: number | null) => {
    const moving = tasks.find((t) => t.id === id)
    if (!moving) return
    const rest = tasks.filter((t) => t.id !== id)
    const index = beforeId === null ? -1 : rest.findIndex((t) => t.id === beforeId)
    const moved = { ...moving, status }
    setTasks(index < 0 ? [...rest, moved] : [...rest.slice(0, index), moved, ...rest.slice(index)])
    void runAction(() => moveTask(id, status, beforeId))
  }

  const handleChange = (task: Task, fields: { priority: Priority | null; dueDate: string | null }) => {
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, ...fields } : t)))
    void runAction(() => updateTask(task.id, fields))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>タスク管理ボード</h1>
      </header>
      <TaskForm onCreated={() => setReloadKey((k) => k + 1)} />
      <SearchForm condition={condition} onSearch={setCondition} />
      {error && <p className="message error">読み込みに失敗しました: {error}</p>}
      {actionError && <p className="message error">{actionError}</p>}
      {loading && !error && <p className="message">読み込み中...</p>}
      <Board tasks={tasks} onMove={handleMove} onChange={handleChange} />
    </div>
  )
}
