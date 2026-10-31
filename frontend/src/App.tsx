import { useState } from 'react'
import Board from './components/Board.tsx'
import SearchForm from './components/SearchForm.tsx'
import { useTaskSearch } from './hooks/useTaskApi.ts'
import type { SearchCondition } from './types.ts'

const INITIAL_CONDITION: SearchCondition = { keyword: '', status: '', priority: '' }

export default function App() {
  const [condition, setCondition] = useState<SearchCondition>(INITIAL_CONDITION)
  const { tasks, loading, error } = useTaskSearch(condition)

  return (
    <div className="app">
      <header className="app-header">
        <h1>タスク管理ボード</h1>
      </header>
      <SearchForm condition={condition} onSearch={setCondition} />
      {error && <p className="message error">読み込みに失敗しました: {error}</p>}
      {loading && !error && <p className="message">読み込み中...</p>}
      <Board tasks={tasks} />
    </div>
  )
}
