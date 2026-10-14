import Column from './Column.jsx'

const COLUMNS = [
  { status: 'TODO', title: 'やること' },
  { status: 'IN_PROGRESS', title: '進行中' },
  { status: 'DONE', title: '完了' },
]

export default function Board({ tasks }) {
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
