import 'dotenv/config'
import express, { Express } from 'express'
import 'express-async-errors' // This is a lib that will automatically catch all async errors

const app: Express = express() // Initialize express app

app.use(express.json()) // Parse all JSON in incoming requests so they can be used as JS objects

export { app } // Export the app so it can be used in tests and the in the server.ts file
