import { Request, Response } from "express"
import { validatePathId } from "../../../src/middlewares"
import mongoose from "mongoose"

describe('validatePathId middleware unit test', () => {
  const mockReq = {} as Request
  const mockRes = {} as Response
  const mockNext = jest.fn()

  beforeAll(() => {
    mockRes.status = jest.fn().mockReturnValue(mockRes)
    mockRes.json = jest.fn()

    // Here I'm mocking the isValidObjectId function from mongoose so I can control the return value
    jest.spyOn(mongoose, 'isValidObjectId')
      .mockReturnValueOnce(true) // First call
      .mockReturnValueOnce(true) // Second call
      .mockReturnValueOnce(false) // Third call
  })

  mockReq.params = { id: 'fake ObjectId' }

  it('Should call isValidObjectId req.params.id as argument', () => {
    validatePathId(mockReq, mockRes, mockNext)

    expect(mongoose.isValidObjectId).toHaveBeenCalledWith(mockReq.params.id)
  })

  describe('When isValidObjectId returns true', () => {
    it('Should call next with no arguments', () => {
      validatePathId(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
    })
  })

  describe('When isValidObjectId returns false', () => {
    it('Should 400 with "ID must be a valid ObjectId" message', () => {
      validatePathId(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'ID must be a valid ObjectId' })
    })
  })
})