import { updateTaskMembersOrTagsValidator, updateTaskMembersOrTagsSchema } from '../../../../src/validators'

describe('updateTaskMembersOrTagsValidator unit tests', () => {
  beforeAll(() => {
    // Here I'm mocking the joi's schema validate method to control the validation result
    jest.spyOn(updateTaskMembersOrTagsSchema, 'validate')
      .mockReturnValueOnce({ error: 'error', value: 'value' } as any) // First call
      .mockReturnValueOnce({ error: undefined, value: 'value' } as any) // Second call
  })

  describe('When Joi schema validate method returns an error', () => {
    it('Should return an object with error and value', () => {
      const { error, value } = updateTaskMembersOrTagsValidator({})

      expect(error).toEqual('error')
      expect(value).toEqual('value')
    })
  })

  describe('When Joi schema validate method does not return an error', () => {
    it('Should return an object with value only', () => {
      const { error, value } = updateTaskMembersOrTagsValidator({})

      expect(error).toBeUndefined()
      expect(value).toEqual('value')
    })
  })
})