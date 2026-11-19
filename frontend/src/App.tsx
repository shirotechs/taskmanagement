import { useState } from 'react'
import Board from './components/Board.tsx'
import SearchForm from './components/SearchForm.tsx'
import TaskForm from './components/TaskForm.tsx'
import { deleteTask, moveTask, updateTask, useTaskSearch } from './hooks/useTaskApi.ts'
import type { SearchCondition, Status, Task, TaskFields } from './types.ts'

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

  // displayedIds: 並び替え表示中の移動先列の表示順(ドラッグ中のカードを除く)。指定時はその順序を確定する
  const handleMove = (id: number, status: Status, beforeId: number | null, displayedIds?: number[]) => {
    const moving = tasks.find((t) => t.id === id)
    if (!moving) return
    const moved = { ...moving, status }
    const rest = tasks.filter((t) => t.id !== id)

    if (displayedIds) {
      const index = beforeId === null ? -1 : displayedIds.indexOf(beforeId)
      const orderedIds = index < 0 ? [...displayedIds, id] : [...displayedIds.slice(0, index), id, ...displayedIds.slice(index)]
      const byId = new Map([...rest, moved].map((t) => [t.id, t]))
      const others = rest.filter((t) => t.status !== status)
      setTasks([...others, ...orderedIds.map((i) => byId.get(i)!)])
      // 既存のmove APIで、確定したい順に末尾へ移していく(直列で実行)
      void runAction(async () => {
        for (const orderedId of orderedIds) await moveTask(orderedId, status, null)
      })
      return
    }

    const index = beforeId === null ? -1 : rest.findIndex((t) => t.id === beforeId)
    setTasks(index < 0 ? [...rest, moved] : [...rest.slice(0, index), moved, ...rest.slice(index)])
    void runAction(() => moveTask(id, status, beforeId))
  }

  const handleChange = (task: Task, patch: Partial<TaskFields>) => {
    const fields: TaskFields = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      ...patch,
    }
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, ...fields } : t)))
    void runAction(() => updateTask(task.id, fields))
  }

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id))
    void runAction(() => deleteTask(id))
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
      <Board tasks={tasks} onMove={handleMove} onChange={handleChange} onDelete={handleDelete} />
    </div>
  )
}
