import Card from './Card.jsx'

export default function Column({ title, tasks }) {
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
