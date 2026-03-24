import { useCallback, useEffect, useState } from 'react'
import type { Todo } from '../types'

const STORAGE_KEY = 'todo-app-tasks'

function parseTodos(raw: string | null): Todo[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isTodo)
  } catch {
    return []
  }
}

function isTodo(x: unknown): x is Todo {
  if (x === null || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.text === 'string' &&
    typeof o.completed === 'boolean' &&
    typeof o.createdAt === 'number'
  )
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() =>
    parseTodos(
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(STORAGE_KEY)
        : null,
    ),
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    )
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }, [])

  return { todos, addTodo, toggleTodo, deleteTodo, clearCompleted }
}
