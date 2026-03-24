import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { STORAGE_KEY } from './lib/todoStorage'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders title and composer', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /todos/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/new task/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^add$/i })).toBeInTheDocument()
  })

  it('shows empty state when there are no tasks', () => {
    render(<App />)
    expect(
      screen.getByText(/no tasks yet/i),
    ).toBeInTheDocument()
  })

  it('adds a task and shows it in the list', async () => {
    const user = userEvent.setup()
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000002',
    )

    render(<App />)

    await user.type(screen.getByLabelText(/new task/i), 'Walk dog')
    await user.click(screen.getByRole('button', { name: /^add$/i }))

    expect(screen.getByText('Walk dog')).toBeInTheDocument()
    const list = screen.getByRole('list')
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
  })

  it('stores todos in localStorage after add', async () => {
    const user = userEvent.setup()
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000003',
    )
    vi.spyOn(Date, 'now').mockReturnValue(12_345)

    localStorage.removeItem(STORAGE_KEY)
    render(<App />)

    await user.type(screen.getByLabelText(/new task/i), 'One')
    await user.click(screen.getByRole('button', { name: /^add$/i }))

    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toMatchObject({
      id: '00000000-0000-4000-8000-000000000003',
      text: 'One',
      completed: false,
      createdAt: 12_345,
    })
  })
})
