import type { Task } from '../types.ts'
import Card from './Card.tsx'

interface Props {
  title: string
  tasks: Task[]
}

export default function Column({ title, tasks }: Props) {
  return (
    <section className="column">
      <h2>
        {title} <span className="count">{tasks.length}</span>
      </h2>
      <div className="cards">
        {tasks.length === 0 && <p className="empty">タスクはありません</p>}
        {tasks.map((task) => (
          <Card key={task.id} task={task} />
        ))}
      </div>
    </section>
  )
}
