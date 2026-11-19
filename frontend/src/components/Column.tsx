import { useRef, useState } from 'react'
import { sortTasks } from '../sortTasks.ts'
import type { SortMode, Status, Task, TaskFields } from '../types.ts'
import Card from './Card.tsx'

interface Props {
  status: Status
  title: string
  tasks: Task[]
  draggingId: number | null
  onDragStart: (id: number) => void
  onDragEnd: () => void
  sortMode: SortMode
  onSortChange: (mode: SortMode) => void
  onMove: (id: number, status: Status, beforeId: number | null, displayedIds?: number[]) => void
  onChange: (task: Task, patch: Partial<TaskFields>) => void
  onDelete: (id: number) => void
}

const SORT_OPTIONS: { mode: SortMode; label: string }[] = [
  { mode: 'priority', label: '優先度順' },
  { mode: 'dueDate', label: '期限順' },
]

export default function Column({
  status, title, tasks: rawTasks, draggingId, onDragStart, onDragEnd, sortMode, onSortChange, onMove, onChange, onDelete,
}: Props) {
  const tasks = sortTasks(rawTasks, sortMode)
  const cardsRef = useRef<HTMLDivElement>(null)
  // ドラッグ中の挿入位置。undefined=この列の上にいない、null=末尾、数値=そのカードの直前
  const [dropBefore, setDropBefore] = useState<number | null | undefined>(undefined)

  // マウスのY座標より下にある最初のカードの手前に挿入する
  const findBeforeId = (clientY: number): number | null => {
    const cards = cardsRef.current?.querySelectorAll<HTMLElement>('.card') ?? []
    for (const el of cards) {
      const id = Number(el.dataset.taskId)
      if (id === draggingId) continue
      const rect = el.getBoundingClientRect()
      if (clientY < rect.top + rect.height / 2) return id
    }
    return null
  }

  return (
    <section
      className={`column${dropBefore !== undefined ? ' drag-over' : ''}`}
      onDragOver={(e) => {
        if (draggingId === null) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setDropBefore(findBeforeId(e.clientY))
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDropBefore(undefined)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setDropBefore(undefined)
        if (draggingId === null) return
        // 並び替え中は、表示中の順序(ドラッグ中のカードを除く)を渡して確定させる
        const displayedIds = sortMode === 'manual' ? undefined : tasks.map((t) => t.id).filter((id) => id !== draggingId)
        onMove(draggingId, status, findBeforeId(e.clientY), displayedIds)
      }}
    >
      <h2>
        {title} <span className="count">{tasks.length}</span>
        <span className="sort-buttons">
          {SORT_OPTIONS.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              className={`sort-button${sortMode === mode ? ' active' : ''}`}
              aria-pressed={sortMode === mode}
              onClick={() => onSortChange(sortMode === mode ? 'manual' : mode)}
            >
              {label}
            </button>
          ))}
        </span>
      </h2>
      <div className="cards" ref={cardsRef}>
        {tasks.length === 0 && <p className="empty">タスクはありません</p>}
        {tasks.map((task) => (
          <div key={task.id} className="card-slot">
            {dropBefore === task.id && <div className="drop-line" />}
            <Card
              task={task}
              dragging={task.id === draggingId}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onChange={onChange}
              onDelete={onDelete}
            />
          </div>
        ))}
        {dropBefore === null && <div className="drop-line end" />}
      </div>
    </section>
  )
}
