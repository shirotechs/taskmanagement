import { useState } from 'react'
import type { Priority, SearchCondition, Status } from '../types.ts'

interface Props {
  condition: SearchCondition
  onSearch: (condition: SearchCondition) => void
}

// キーワードは「検索」ボタン/Enterで確定、プルダウンは変更時に即反映する
export default function SearchForm({ condition, onSearch }: Props) {
  const [keyword, setKeyword] = useState(condition.keyword)

  const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch({ ...condition, keyword: keyword.trim() })
  }

  const reset = () => {
    setKeyword('')
    onSearch({ keyword: '', status: '', priority: '' })
  }

  return (
    <form className="search-form" onSubmit={submit}>
      <input
        type="search"
        placeholder="キーワード(タイトル・説明)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <select
        value={condition.status}
        onChange={(e) => onSearch({ ...condition, status: e.target.value as Status | '' })}
      >
        <option value="">ステータス: すべて</option>
        <option value="TODO">やること</option>
        <option value="IN_PROGRESS">進行中</option>
        <option value="DONE">完了</option>
      </select>
      <select
        value={condition.priority}
        onChange={(e) => onSearch({ ...condition, priority: e.target.value as Priority | '' })}
      >
        <option value="">優先度: すべて</option>
        <option value="HIGH">高</option>
        <option value="MEDIUM">中</option>
        <option value="LOW">低</option>
      </select>
      <button type="submit">検索</button>
      <button type="button" className="secondary" onClick={reset}>
        クリア
      </button>
    </form>
  )
}
