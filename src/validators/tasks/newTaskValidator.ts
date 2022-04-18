import Joi from 'joi'
import { TBodyValidator } from '../../ts/types'

// Joi is a lib I like to use for validations because it's easy to use and very complete.
// The validation parameters are pretty much self-explanatory but if you want to know more
// about Joi, you can check out the docs here: https://joi.dev/

export const newTaskSchema = Joi.object({ // This is exported for testing purposes.
  boardId: Joi.number().integer().positive().required().messages({ // This would probably be changed to an ObjectId string if we have a "boards" collection
    'number.base': '400|{#label} must be a positive integer',
    'number.integer': '400|{#label} must be a positive integer',
    'number.positive': '400|{#label} must be a positive integer',
    'any.required': '400|{#label} is required'
  }),
  status: Joi.string().trim().required().messages({ // This would probably be replaced by a column_id; ex: "BACKLOG" | "IN_PROGRESS" | "DONE", etc.
    'string.base': '400|{#label} must be a string',
    'string.empty': '400|{#label} can not be an empty string',
    'any.required': '400|{#label} is required'
  }),
  title: Joi.string().trim().required().messages({
    'string.base': '400|{#label} must be a string',
    'string.empty': '400|{#label} can not be an empty string',
    'any.required': '400|{#label} is required'
  }),
  description: Joi.string().empty('').trim().default('').messages({
    'string.base': '400|{#label} must be a string'
  }),
  priority: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': '400|{#label} must be an integer',
    'number.integer': '400|{#label} must be an integer',
    'number.min': '400|{#label} must be an integer between 1 and 5',
    'number.max': '400|{#label} must be an integer between 1 and 5',
    'any.required': '400|{#label} is required'
  }),
  members: Joi.array().items(Joi.string().trim()).default([]).messages({ // This type would probably be an array of ObjectIds if we have a "users" collection
    'array.base': '400|{#label} must be an array',
    'string.base': '400|{#label} must be a string',
    'string.empty': '400|{#label} can not be an empty string'
  }),
  tags: Joi.array().items(Joi.string().trim()).default([]).messages({
    'array.base': '400|{#label} must be an array',
    'string.base': '400|{#label} must be a string',
    'string.empty': '400|{#label} can not be an empty string'
  })
}).messages({
  'object.unknown': '400|Unknown property: {#label}'
})

// Ps: Curious about the weird messages with "code|message" format? Read the explanation in middlewares/validateBody.ts
// Ps2: {#label} is a placeholder for the property name that failed validation.

// This function acts as an adapter between the Joi validation library and the
// application, making it easy to change the validation library later if needed.
export const newTaskValidator: TBodyValidator = (body) => {
  const { error, value } = newTaskSchema.validate(body)

  return { error, value }
}
