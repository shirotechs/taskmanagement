import type { Priority, Task } from '../types.ts'

interface Props {
  task: Task
  dragging: boolean
  onDragStart: (id: number) => void
  onDragEnd: () => void
  onChange: (task: Task, fields: { priority: Priority | null; dueDate: string | null }) => void
}

export default function Card({ task, dragging, onDragStart, onDragEnd, onChange }: Props) {
  return (
    <article
      className={`card${dragging ? ' dragging' : ''}`}
      data-task-id={task.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', String(task.id))
        onDragStart(task.id)
      }}
      onDragEnd={onDragEnd}
    >
      <h3>{task.title}</h3>
      {task.description && <p className="description">{task.description}</p>}
      <div className="meta">
        <select
          className={`priority-select ${task.priority ? `priority-${task.priority.toLowerCase()}` : ''}`}
          aria-label="優先度"
          value={task.priority ?? ''}
          onChange={(e) =>
            onChange(task, { priority: (e.target.value || null) as Priority | null, dueDate: task.dueDate })
          }
        >
          <option value="">優先度: 未設定</option>
          <option value="HIGH">優先度: 高</option>
          <option value="MEDIUM">優先度: 中</option>
          <option value="LOW">優先度: 低</option>
        </select>
        <input
          type="date"
          className="due-input"
          aria-label="期限日"
          value={task.dueDate ?? ''}
          onChange={(e) => onChange(task, { priority: task.priority, dueDate: e.target.value || null })}
        />
      </div>
    </article>
  )
}
