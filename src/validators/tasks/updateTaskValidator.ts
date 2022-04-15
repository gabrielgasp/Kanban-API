import Joi from 'joi'
import { TBodyValidator } from '../../ts/types'

// Joi is a lib I like to use for validations because it's easy to use and very complete.
// The validation parameters are pretty much self-explanatory but if you want to know more
// about Joi, you can check out the docs here: https://joi.dev/

export const updateTaskSchema = Joi.object({ // This is exported for testing purposes.
  boardId: Joi.forbidden().messages({
    'any.unknown': '400|{#label} can not be updated'
  }),
  status: Joi.string().trim().messages({ // This would probably be replaced by a column_id; ex: "BACKLOG" | "IN_PROGRESS" | "DONE", etc.
    'string.base': '400|{#label} must be a string',
    'string.empty': '400|{#label} can not be empty string'
  }),
  title: Joi.string().trim().messages({
    'string.base': '400|{#label} must be a string',
    'string.empty': '400|{#label} can not be empty string'
  }),
  description: Joi.string().allow('').trim().messages({
    'string.base': '400|{#label} must be a string'
  }),
  members: Joi.array().items(Joi.string().trim()).messages({ // This type would probably be an array of ObjectIds if we have a "users" collection
    'array.base': '400|{#label} must be an array',
    'string.base': '400|{#label} must be a string',
    'string.empty': '400|{#label} can not be an empty string'
  }),
  tags: Joi.array().items(Joi.string().trim()).messages({ // This type would probably be an array of ObjectIds if we have a "tags" collection
    'array.base': '400|{#label} must be an array',
    'string.base': '400|{#label} must be a string',
    'string.empty': '400|{#label} can not be an empty string'
  })
}).messages({
  'object.unknown': '400|Unknown property: {#label}'
})

// This function acts as an adapter between the Joi validation library and the
// application, making it easy to change the validation library later if needed.
export const updateTaskValidator: TBodyValidator = (body) => {
  const { error, value } = updateTaskSchema.validate(body)

  return { error, value }
}
