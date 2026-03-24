import { describe, expect, it } from 'vitest'
import { isTodo, parseTodosFromStorage, STORAGE_KEY } from './todoStorage'
import type { Todo } from '../types'

describe('STORAGE_KEY', () => {
  it('is a non-empty string', () => {
    expect(STORAGE_KEY.length).toBeGreaterThan(0)
  })
})

describe('isTodo', () => {
  const valid: Todo = {
    id: 'a',
    text: 'x',
    completed: false,
    createdAt: 1,
  }

  it('accepts a valid todo object', () => {
    expect(isTodo(valid)).toBe(true)
  })

  it('rejects null', () => {
    expect(isTodo(null)).toBe(false)
  })

  it('rejects primitives', () => {
    expect(isTodo(undefined)).toBe(false)
    expect(isTodo('string')).toBe(false)
    expect(isTodo(42)).toBe(false)
  })

  it('rejects arrays', () => {
    expect(isTodo([])).toBe(false)
    expect(isTodo([valid])).toBe(false)
  })

  it('rejects objects with wrong field types', () => {
    expect(
      isTodo({ ...valid, id: 1 }),
    ).toBe(false)
    expect(
      isTodo({ ...valid, text: null }),
    ).toBe(false)
    expect(
      isTodo({ ...valid, completed: 'yes' }),
    ).toBe(false)
    expect(
      isTodo({ ...valid, createdAt: '1' }),
    ).toBe(false)
  })

  it('rejects objects missing fields', () => {
    expect(isTodo({})).toBe(false)
    expect(isTodo({ id: 'a' })).toBe(false)
  })

  it('allows extra properties (still a Todo structurally)', () => {
    expect(
      isTodo({ ...valid, extra: true }),
    ).toBe(true)
  })
})

describe('parseTodosFromStorage', () => {
  it('returns empty array for null', () => {
    expect(parseTodosFromStorage(null)).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(parseTodosFromStorage('')).toEqual([])
  })

  it('returns empty array for invalid JSON', () => {
    expect(parseTodosFromStorage('not json')).toEqual([])
  })

  it('returns empty array when JSON is not an array', () => {
    expect(parseTodosFromStorage('{}')).toEqual([])
    expect(parseTodosFromStorage('"hi"')).toEqual([])
  })

  it('returns empty array for empty JSON array', () => {
    expect(parseTodosFromStorage('[]')).toEqual([])
  })

  it('parses a single valid todo', () => {
    const todo: Todo = {
      id: '1',
      text: 'Buy milk',
      completed: true,
      createdAt: 1700000000000,
    }
    expect(parseTodosFromStorage(JSON.stringify([todo]))).toEqual([todo])
  })

  it('filters out invalid entries and keeps valid ones', () => {
    const good: Todo = {
      id: 'ok',
      text: 'x',
      completed: false,
      createdAt: 0,
    }
    const raw = JSON.stringify([good, null, { id: 'bad' }, 'nope', good])
    expect(parseTodosFromStorage(raw)).toEqual([good, good])
  })

  it('does not mutate stored data', () => {
    const raw = JSON.stringify([
      {
        id: '1',
        text: 'a',
        completed: false,
        createdAt: 1,
      },
    ])
    parseTodosFromStorage(raw)
    expect(JSON.parse(raw)).toHaveLength(1)
  })
})
