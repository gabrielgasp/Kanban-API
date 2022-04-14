import 'dotenv/config'
import express, { Express } from 'express'
import 'express-async-errors' // This is a lib that will automatically catch all async errors and send them to the error handler
import { errorHandler } from './middlewares'

const app: Express = express() // Initialize express app

app.use(express.json()) // Parse all JSON in incoming requests so they can be used as JS objects

app.use(errorHandler) // Receive errors when next(error) is called

export { app } // Export the app so it can be used in tests and the in the server.ts file
