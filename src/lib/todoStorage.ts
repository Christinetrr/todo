import type { Todo } from '../types'

export const STORAGE_KEY = 'todo-app-tasks'

export function isTodo(x: unknown): x is Todo {
  if (x === null || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.text === 'string' &&
    typeof o.completed === 'boolean' &&
    typeof o.createdAt === 'number'
  )
}

export function parseTodosFromStorage(raw: string | null): Todo[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isTodo)
  } catch {
    return []
  }
}
