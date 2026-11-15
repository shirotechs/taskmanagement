import { useRef, useState } from 'react'
import type { Priority, Status, Task } from '../types.ts'
import Card from './Card.tsx'

interface Props {
  status: Status
  title: string
  tasks: Task[]
  draggingId: number | null
  onDragStart: (id: number) => void
  onDragEnd: () => void
  onMove: (id: number, status: Status, beforeId: number | null) => void
  onChange: (task: Task, fields: { priority: Priority | null; dueDate: string | null }) => void
}

export default function Column({
  status, title, tasks, draggingId, onDragStart, onDragEnd, onMove, onChange,
}: Props) {
  const cardsRef = useRef<HTMLDivElement>(null)
  const [over, setOver] = useState(false)

  // ドロップ位置(マウスのY座標)より下にある最初のカードの手前に挿入する
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
      className={`column${over ? ' drag-over' : ''}`}
      onDragOver={(e) => {
        if (draggingId === null) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setOver(true)
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        if (draggingId !== null) onMove(draggingId, status, findBeforeId(e.clientY))
      }}
    >
      <h2>
        {title} <span className="count">{tasks.length}</span>
      </h2>
      <div className="cards" ref={cardsRef}>
        {tasks.length === 0 && <p className="empty">タスクはありません</p>}
        {tasks.map((task) => (
          <Card
            key={task.id}
            task={task}
            dragging={task.id === draggingId}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  )
}
