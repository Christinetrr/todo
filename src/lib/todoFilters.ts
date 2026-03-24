import type { Todo, TodoFilter } from '../types'

export function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  if (filter === 'active') return todos.filter((t) => !t.completed)
  if (filter === 'completed') return todos.filter((t) => t.completed)
  return todos
}

export function countActive(todos: Todo[]): number {
  return todos.filter((t) => !t.completed).length
}

export function countCompleted(todos: Todo[]): number {
  return todos.filter((t) => t.completed).length
}
