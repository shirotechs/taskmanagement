import type { Priority, SortMode, Task } from './types.ts'

const PRIORITY_RANK: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }

// 並び替えモードに応じた表示順を返す(同順位は元の順序を保つ)
export function sortTasks(tasks: Task[], mode: SortMode): Task[] {
  if (mode === 'manual') return tasks
  const key = (t: Task): number | string =>
    mode === 'priority'
      ? t.priority ? PRIORITY_RANK[t.priority] : 3
      : t.dueDate ?? '9999-99-99'
  return [...tasks].sort((a, b) => {
    const ka = key(a)
    const kb = key(b)
    return ka < kb ? -1 : ka > kb ? 1 : 0
  })
}
