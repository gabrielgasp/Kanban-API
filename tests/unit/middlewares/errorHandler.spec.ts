import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../../../src/middlewares'

describe('errorHandler middleware unit tests', () => {
  const mockReq = {} as Request
  const mockRes = {} as Response
  const mockNext = vi.fn() as unknown as NextFunction

  beforeEach(() => {
    mockRes.status = vi.fn().mockReturnValue(mockRes) // Just like the original res.status, this will return the response object
    mockRes.json = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => null) // We mock the console.error method so that we can test without printing the error to the console
  })

  describe('When receive an unexpected error', () => {
    const error = new Error('Unexpected error')
    it('Should 500 with a generic error message', () => {
      errorHandler(error, mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Something went wrong here, please try again later' })
    })
  })
})