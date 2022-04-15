import { ValidationError } from 'joi'

export type TBodyValidator = (body: unknown) => {
  error: ValidationError | undefined
  value: unknown
}
