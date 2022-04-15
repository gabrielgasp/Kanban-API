import { Request, Response } from "express"
import { validateBody } from "../../../src/middlewares"

describe('validateBody middleware unit test', () => {
  const mockReq = { body: {} } as Request
  const mockRes = {} as Response
  const mockNext = jest.fn()
  const mockBodyValidator = jest.fn()

  beforeAll(() => {
    mockRes.status = jest.fn().mockReturnValue(mockRes)
    mockRes.json = jest.fn()
  })

  it('Should call bodyValidator function with req.body as argument', () => {
    mockBodyValidator.mockReturnValue({ error: undefined, value: {} })

    validateBody(mockBodyValidator)(mockReq, mockRes, mockNext)

    expect(mockBodyValidator).toHaveBeenCalledWith(mockReq.body)
  })

  describe('When validation fails with a handled error', () => {
    it('Should respond with code and message from error.message', () => {
      mockBodyValidator.mockReturnValue({
        error: { message: '400|Error message' },
        value: {}
      })

      validateBody(mockBodyValidator)(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error message' })
    })
  })

  describe('When validation fails with an unhandled error', () => {
    it('Should call next with error', () => {
      mockBodyValidator.mockReturnValue({
        error: { message: 'Unhandled error' },
        value: {}
      })

      validateBody(mockBodyValidator)(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith({ message: 'Unhandled error' })
    })
  })

  describe('When validation passes', () => {
    it('Should replace body with value and call "next" method', () => {
      mockBodyValidator.mockReturnValue({
        error: undefined,
        value: { a: 1 }
      })

      validateBody(mockBodyValidator)(mockReq, mockRes, mockNext)

      expect(mockReq.body).toEqual({ a: 1 })
      expect(mockNext).toHaveBeenCalled()
    })
  })
})