import Joi from 'joi'
import { TBodyValidator } from '../../ts/types'

// Joi is a lib I like to use for validations because it's easy to use and very complete.
// The validation parameters are pretty much self-explanatory but if you want to know more
// about Joi, you can check out the docs here: https://joi.dev/

export const updateTaskMembersOrTagsSchema = Joi.object({ // This is exported for testing purposes.
  operation: Joi.number().valid(1, '1', -1, '-1').required().messages({
    'any.only': '400|{#label} must be 1 (add) or -1 (remove)',
    'any.required': '400|{#label} is required'
  }),
  value: Joi.string().trim().required().messages({
    'string.base': '400|{#label} must be a string',
    'string.empty': '400|{#label} can not be an empty string',
    'any.required': '400|{#label} is required'
  })
}).messages({
  'object.unknown': '400|Unknown property: {#label}'
})

// Ps: Curious about the weird messages with "code|message" format? Read the explanation in middlewares/validateBody.ts
// Ps2: {#label} is a placeholder for the property name that failed validation.

// This function acts as an adapter between the Joi validation library and the
// application, making it easy to change the validation library later if needed.
export const updateTaskMembersOrTagsValidator: TBodyValidator = (body) => {
  const { error, value } = updateTaskMembersOrTagsSchema.validate(body)

  return { error, value }
}
