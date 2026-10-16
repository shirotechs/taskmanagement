// BEの TaskResponse / Task.Status / Task.Priority に対応する型
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Task {
  id: number
  title: string
  description: string | null
  priority: Priority | null
  dueDate: string | null // yyyy-MM-dd
  status: Status
  createdAt: string
  updatedAt: string
}

// 検索条件(空文字は「指定なし」)
export interface SearchCondition {
  keyword: string
  status: Status | ''
  priority: Priority | ''
}
