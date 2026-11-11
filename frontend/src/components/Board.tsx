import { useState } from 'react'
import type { Priority, Status, Task } from '../types.ts'
import Column from './Column.tsx'

const COLUMNS: { status: Status; title: string }[] = [
  { status: 'TODO', title: 'やること' },
  { status: 'IN_PROGRESS', title: '進行中' },
  { status: 'DONE', title: '完了' },
]

interface Props {
  tasks: Task[]
  onMove: (id: number, status: Status, beforeId: number | null) => void
  onChange: (task: Task, fields: { priority: Priority | null; dueDate: string | null }) => void
}

export default function Board({ tasks, onMove, onChange }: Props) {
  const [draggingId, setDraggingId] = useState<number | null>(null)

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
          onMove={onMove}
          onChange={onChange}
        />
      ))}
    </main>
  )
}
