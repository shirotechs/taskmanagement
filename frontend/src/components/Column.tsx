import { useRef, useState } from 'react'
import type { Status, Task, TaskFields } from '../types.ts'
import Card from './Card.tsx'

interface Props {
  status: Status
  title: string
  tasks: Task[]
  draggingId: number | null
  onDragStart: (id: number) => void
  onDragEnd: () => void
  onMove: (id: number, status: Status, beforeId: number | null) => void
  onChange: (task: Task, patch: Partial<TaskFields>) => void
  onDelete: (id: number) => void
}

export default function Column({
  status, title, tasks, draggingId, onDragStart, onDragEnd, onMove, onChange, onDelete,
}: Props) {
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
        if (draggingId !== null) onMove(draggingId, status, findBeforeId(e.clientY))
      }}
    >
      <h2>
        {title} <span className="count">{tasks.length}</span>
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
