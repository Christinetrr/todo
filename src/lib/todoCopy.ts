import type { TodoFilter } from '../types'

export function getEmptyListMessage(
  totalTodos: number,
  filter: TodoFilter,
): string {
  if (totalTodos === 0) return 'No tasks yet. Add one above.'
  if (filter === 'active') return 'Nothing left to do — nice.'
  if (filter === 'completed') return 'No completed tasks yet.'
  return 'No tasks match this filter.'
}

export function formatTasksLeftLabel(activeCount: number): string {
  return activeCount === 1 ? '1 task left' : `${activeCount} tasks left`
}
