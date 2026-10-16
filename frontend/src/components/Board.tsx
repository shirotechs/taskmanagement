import type { Status, Task } from '../types.ts'
import Column from './Column.tsx'

const COLUMNS: { status: Status; title: string }[] = [
  { status: 'TODO', title: 'やること' },
  { status: 'IN_PROGRESS', title: '進行中' },
  { status: 'DONE', title: '完了' },
]

export default function Board({ tasks }: { tasks: Task[] }) {
  return (
    <main className="board">
      {COLUMNS.map(({ status, title }) => (
        <Column
          key={status}
          title={title}
          tasks={tasks.filter((t) => t.status === status)}
        />
      ))}
    </main>
  )
}
