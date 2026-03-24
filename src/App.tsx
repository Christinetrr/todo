import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useTodos } from './hooks/useTodos'
import type { TodoFilter } from './types'
import './App.css'

const FILTER_STORAGE_KEY = 'todo-app-filter'

function readStoredFilter(): TodoFilter {
  if (typeof localStorage === 'undefined') return 'all'
  const raw = localStorage.getItem(FILTER_STORAGE_KEY)
  if (raw === 'active' || raw === 'completed' || raw === 'all') return raw
  return 'all'
}

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos()
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState<TodoFilter>(readStoredFilter)

  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, filter)
  }, [filter])

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed)
    if (filter === 'completed') return todos.filter((t) => t.completed)
    return todos
  }, [todos, filter])

  const activeCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  )

  const completedCount = todos.length - activeCount

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    addTodo(draft)
    setDraft('')
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Todos</h1>
        <p className="subtitle">Keep tasks in one place. Saved in this browser.</p>
      </header>

      <form className="composer" onSubmit={onSubmit}>
        <label htmlFor="new-todo" className="visually-hidden">
          New task
        </label>
        <input
          id="new-todo"
          className="input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What needs doing?"
          autoComplete="off"
        />
        <button type="submit" className="btn primary" disabled={!draft.trim()}>
          Add
        </button>
      </form>

      <div className="toolbar" role="tablist" aria-label="Filter tasks">
        {(
          [
            ['all', 'All'],
            ['active', 'Active'],
            ['completed', 'Done'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            className={`tab${filter === value ? ' tab-active' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="empty">
          {todos.length === 0
            ? 'No tasks yet. Add one above.'
            : filter === 'active'
              ? 'Nothing left to do — nice.'
              : filter === 'completed'
                ? 'No completed tasks yet.'
                : 'No tasks match this filter.'}
        </p>
      ) : (
        <ul className="list">
          {filtered.map((todo) => (
            <li key={todo.id} className="item">
              <label className="row">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={`label${todo.completed ? ' done' : ''}`}>
                  {todo.text}
                </span>
              </label>
              <button
                type="button"
                className="btn ghost danger"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete: ${todo.text}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <footer className="footer">
          <span className="meta">
            {activeCount === 1 ? '1 task left' : `${activeCount} tasks left`}
          </span>
          {completedCount > 0 && (
            <button type="button" className="btn link" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </footer>
      )}
    </div>
  )
}

export default App
