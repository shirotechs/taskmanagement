import type { Priority, Task } from '../types.ts'

const PRIORITY_LABEL: Record<Priority, string> = { HIGH: '高', MEDIUM: '中', LOW: '低' }

export default function Card({ task }: { task: Task }) {
  return (
    <article className="card">
      <h3>{task.title}</h3>
      {task.description && <p className="description">{task.description}</p>}
      <div className="meta">
        {task.priority && (
          <span className={`badge priority-${task.priority.toLowerCase()}`}>
            優先度: {PRIORITY_LABEL[task.priority]}
          </span>
        )}
        {task.dueDate && <span className="due">期限: {task.dueDate}</span>}
      </div>
    </article>
  )
}
