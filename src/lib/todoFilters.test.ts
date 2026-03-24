import { describe, expect, it } from 'vitest'
import { countActive, countCompleted, filterTodos } from './todoFilters'
import type { Todo } from '../types'

const t = (partial: Partial<Todo> & Pick<Todo, 'id'>): Todo => ({
  id: partial.id,
  text: partial.text ?? '',
  completed: partial.completed ?? false,
  createdAt: partial.createdAt ?? 0,
})

const sample: Todo[] = [
  t({ id: '1', text: 'a', completed: false }),
  t({ id: '2', text: 'b', completed: true }),
  t({ id: '3', text: 'c', completed: false }),
]

describe('filterTodos', () => {
  it('returns all todos for filter "all"', () => {
    expect(filterTodos(sample, 'all')).toEqual(sample)
    expect(filterTodos([], 'all')).toEqual([])
  })

  it('returns only incomplete for "active"', () => {
    expect(filterTodos(sample, 'active')).toEqual([sample[0], sample[2]])
  })

  it('returns only completed for "completed"', () => {
    expect(filterTodos(sample, 'completed')).toEqual([sample[1]])
  })

  it('does not mutate the original array', () => {
    const copy = [...sample]
    filterTodos(sample, 'active')
    expect(sample).toEqual(copy)
  })
})

describe('countActive', () => {
  it('counts incomplete todos', () => {
    expect(countActive(sample)).toBe(2)
    expect(countActive([t({ id: 'x', completed: true })])).toBe(0)
    expect(countActive([])).toBe(0)
  })
})

describe('countCompleted', () => {
  it('counts completed todos', () => {
    expect(countCompleted(sample)).toBe(1)
    expect(countCompleted([t({ id: 'x', completed: true })])).toBe(1)
    expect(countCompleted([])).toBe(0)
  })
})

describe('countActive + countCompleted consistency', () => {
  it('sums to total length', () => {
    for (const list of [sample, [], [t({ id: 'only', completed: false })]] as Todo[][]) {
      expect(countActive(list) + countCompleted(list)).toBe(list.length)
    }
  })
})
