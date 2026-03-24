import { describe, expect, it } from 'vitest'
import { formatTasksLeftLabel, getEmptyListMessage } from './todoCopy'

describe('getEmptyListMessage', () => {
  it('shows onboarding when there are no todos regardless of filter', () => {
    expect(getEmptyListMessage(0, 'all')).toBe('No tasks yet. Add one above.')
    expect(getEmptyListMessage(0, 'active')).toBe('No tasks yet. Add one above.')
    expect(getEmptyListMessage(0, 'completed')).toBe('No tasks yet. Add one above.')
  })

  it('shows active-empty copy when filtering active', () => {
    expect(getEmptyListMessage(3, 'active')).toBe(
      'Nothing left to do — nice.',
    )
  })

  it('shows completed-empty copy when filtering completed', () => {
    expect(getEmptyListMessage(2, 'completed')).toBe(
      'No completed tasks yet.',
    )
  })

  it('shows generic no-match for all filter with todos present', () => {
    expect(getEmptyListMessage(1, 'all')).toBe('No tasks match this filter.')
  })
})

describe('formatTasksLeftLabel', () => {
  it('uses singular for 1', () => {
    expect(formatTasksLeftLabel(1)).toBe('1 task left')
  })

  it('uses plural for 0 and counts above 1', () => {
    expect(formatTasksLeftLabel(0)).toBe('0 tasks left')
    expect(formatTasksLeftLabel(2)).toBe('2 tasks left')
    expect(formatTasksLeftLabel(100)).toBe('100 tasks left')
  })
})
