import { describe, it, expect, beforeAll, vi } from 'vitest'
import { newTaskValidator, newTaskSchema } from '../../../../src/validators'

describe('newTaskValidator unit tests', () => {
  beforeAll(() => {
    // Here I'm mocking the joi's schema validate method to control the validation result
    vi.spyOn(newTaskSchema, 'validate')
      .mockReturnValueOnce({ error: 'error', value: 'value' } as any) // First call
      .mockReturnValueOnce({ error: undefined, value: 'value' } as any) // Second call
  })

  describe('When Joi schema validate method returns an error', () => {
    it('Should return an object with error and value', () => {
      const { error, value } = newTaskValidator({})

      expect(error).toEqual('error')
      expect(value).toEqual('value')
    })
  })

  describe('When Joi schema validate method does not return an error', () => {
    it('Should return an object with value only', () => {
      const { error, value } = newTaskValidator({})

      expect(error).toBeUndefined()
      expect(value).toEqual('value')
    })
  })
})