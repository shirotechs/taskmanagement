import { useState } from 'react'
import type { SortMode, Status, Task, TaskFields } from '../types.ts'
import Column from './Column.tsx'

const COLUMNS: { status: Status; title: string }[] = [
  { status: 'TODO', title: 'やること' },
  { status: 'IN_PROGRESS', title: '進行中' },
  { status: 'DONE', title: '完了' },
]

interface Props {
  tasks: Task[]
  onMove: (id: number, status: Status, beforeId: number | null, displayedIds?: number[]) => void
  onChange: (task: Task, patch: Partial<TaskFields>) => void
  onDelete: (id: number) => void
}

export default function Board({ tasks, onMove, onChange, onDelete }: Props) {
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [sortModes, setSortModes] = useState<Record<Status, SortMode>>({
    TODO: 'manual',
    IN_PROGRESS: 'manual',
    DONE: 'manual',
  })

  const setSortMode = (status: Status, mode: SortMode) =>
    setSortModes((prev) => ({ ...prev, [status]: mode }))

  // 並び替え中の列へドロップしたら、表示順を確定して手動モードに戻す
  const handleMove = (id: number, status: Status, beforeId: number | null, displayedIds?: number[]) => {
    onMove(id, status, beforeId, displayedIds)
    if (displayedIds) setSortMode(status, 'manual')
  }

  return (
    <main className="board">
      {COLUMNS.map(({ status, title }) => (
        <Column
          key={status}
          status={status}
          title={title}
          tasks={tasks.filter((t) => t.status === status)}
          draggingId={draggingId}
          onDragStart={setDraggingId}
          onDragEnd={() => setDraggingId(null)}
          sortMode={sortModes[status]}
          onSortChange={(mode) => setSortMode(status, mode)}
          onMove={handleMove}
          onChange={onChange}
          onDelete={onDelete}
        />
      ))}
    </main>
  )
}
