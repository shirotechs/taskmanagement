import { useState } from 'react'
import type { Priority, Task, TaskFields } from '../types.ts'

interface Props {
  task: Task
  dragging: boolean
  onDragStart: (id: number) => void
  onDragEnd: () => void
  onChange: (task: Task, patch: Partial<TaskFields>) => void
  onDelete: (id: number) => void
}

export default function Card({ task, dragging, onDragStart, onDragEnd, onChange, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')

  const startEdit = () => {
    setTitle(task.title)
    setDescription(task.description ?? '')
    setEditing(true)
  }

  const save = () => {
    if (!title.trim()) return
    onChange(task, { title: title.trim(), description: description.trim() || null })
    setEditing(false)
  }

  return (
    <article
      className={`card${dragging ? ' dragging' : ''}`}
      data-task-id={task.id}
      draggable={!editing}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', String(task.id))
        onDragStart(task.id)
      }}
      onDragEnd={onDragEnd}
    >
      {editing ? (
        <form
          className="card-edit"
          onSubmit={(e) => {
            e.preventDefault()
            save()
          }}
        >
          <input
            type="text"
            aria-label="タイトル"
            placeholder="タイトル(必須)"
            maxLength={255}
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            aria-label="説明"
            placeholder="説明"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="card-edit-actions">
            <button type="submit" disabled={!title.trim()}>保存</button>
            <button type="button" className="secondary" onClick={() => setEditing(false)}>
              キャンセル
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="card-head">
            <h3>{task.title}</h3>
            <button type="button" className="edit-button" onClick={startEdit}>編集</button>
          </div>
          {task.description && <p className="description">{task.description}</p>}
        </>
      )}
      <div className="meta">
        <select
          className={`priority-select ${task.priority ? `priority-${task.priority.toLowerCase()}` : ''}`}
          aria-label="優先度"
          value={task.priority ?? ''}
          onChange={(e) => onChange(task, { priority: (e.target.value || null) as Priority | null })}
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
          onChange={(e) => onChange(task, { dueDate: e.target.value || null })}
        />
      </div>
      {task.status === 'DONE' && !editing && (
        <button
          type="button"
          className="delete-button"
          onClick={() => {
            if (window.confirm('このタスクを完全に削除します。元に戻せません。よろしいですか?')) {
              onDelete(task.id)
            }
          }}
        >
          削除
        </button>
      )}
    </article>
  )
}
