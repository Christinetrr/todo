import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEY } from '../lib/todoStorage'
import { useTodos } from './useTodos'

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000001',
    )
    vi.spyOn(Date, 'now').mockReturnValue(99_000)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts empty when storage is empty', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toEqual([])
  })

  it('loads initial todos from localStorage', () => {
    const stored = [
      {
        id: 'a',
        text: 'loaded',
        completed: true,
        createdAt: 1,
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toEqual(stored)
  })

  it('addTodo trims text and prepends', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('  first  ')
    })

    expect(result.current.todos).toEqual([
      {
        id: '00000000-0000-4000-8000-000000000001',
        text: 'first',
        completed: false,
        createdAt: 99_000,
      },
    ])
  })

  it('addTodo ignores whitespace-only input', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('   ')
    })
    expect(result.current.todos).toEqual([])
  })

  it('toggleTodo flips completed for matching id', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'x',
          text: 't',
          completed: false,
          createdAt: 1,
        },
      ]),
    )

    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.toggleTodo('x')
    })
    expect(result.current.todos[0].completed).toBe(true)

    act(() => {
      result.current.toggleTodo('x')
    })
    expect(result.current.todos[0].completed).toBe(false)
  })

  it('deleteTodo removes by id', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: '1', text: 'a', completed: false, createdAt: 1 },
        { id: '2', text: 'b', completed: false, createdAt: 2 },
      ]),
    )

    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.deleteTodo('1')
    })
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].id).toBe('2')
  })

  it('clearCompleted removes completed items', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: '1', text: 'a', completed: true, createdAt: 1 },
        { id: '2', text: 'b', completed: false, createdAt: 2 },
      ]),
    )

    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.clearCompleted()
    })
    expect(result.current.todos).toEqual([
      { id: '2', text: 'b', completed: false, createdAt: 2 },
    ])
  })

  it('persists todos to localStorage when state changes', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('persist me')
    })

    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)).toEqual(result.current.todos)
  })
})
