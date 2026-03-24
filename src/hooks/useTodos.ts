import { useCallback, useEffect, useState } from 'react'
import type { Todo } from '../types'
import { parseTodosFromStorage, STORAGE_KEY } from '../lib/todoStorage'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() =>
    parseTodosFromStorage(
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
