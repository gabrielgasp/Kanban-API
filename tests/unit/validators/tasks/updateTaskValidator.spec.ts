import { describe, it, expect, beforeAll, vi } from 'vitest'
import { updateTaskValidator, updateTaskSchema } from '../../../../src/validators'

describe('updateTaskValidator unit tests', () => {
  beforeAll(() => {
    // Here I'm mocking the joi's schema validate method to control the validation result
    vi.spyOn(updateTaskSchema, 'validate')
      .mockReturnValueOnce({ error: 'error', value: 'value' } as any) // First call
      .mockReturnValueOnce({ error: undefined, value: 'value' } as any) // Second call
  })

  describe('When Joi schema validate method returns an error', () => {
    it('Should return an object with error and value', () => {
      const { error, value } = updateTaskValidator({})

      expect(error).toEqual('error')
      expect(value).toEqual('value')
    })
  })

  describe('When Joi schema validate method does not return an error', () => {
    it('Should return an object with value only', () => {
      const { error, value } = updateTaskValidator({})

      expect(error).toBeUndefined()
      expect(value).toEqual('value')
    })
  })
})