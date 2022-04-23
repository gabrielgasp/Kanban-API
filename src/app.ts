import 'dotenv/config'
import express, { Express } from 'express'
import 'express-async-errors' // This is a lib that will automatically catch all async errors and send them to the error handler
import swaggerUi from 'swagger-ui-express'
import swaggerDocumentPt from './swagger_pt.json'
import swaggerDocumentEn from './swagger_en.json'
import { errorHandler } from './middlewares'
import { tasksRouter } from './routes'

const app: Express = express() // Initialize express app

app.disable('x-powered-by') // Disable x-powered-by header as a security measure to prevent information leaks

app.use(express.json()) // Parse all JSON in incoming requests so they can be used as JS objects

app.get('/healthcheck', (_req, res) => res.status(200).send('API HEALTHY')) // API Healthcheck endpoint

app.use('/tasks', tasksRouter) // Mount the tasks router

const swaggerOptions = { customSiteTitle: 'Mamboo Kanban API Docs' }
app.use('/docs/pt', swaggerUi.serveFiles(swaggerDocumentPt), swaggerUi.setup(swaggerDocumentPt, swaggerOptions)) // Apply swagger to route /docs/pt for interactive documentation in portuguese.
app.use('/docs/en', swaggerUi.serveFiles(swaggerDocumentEn), swaggerUi.setup(swaggerDocumentEn, swaggerOptions)) // Apply swagger to route /docs/en for interactive documentation in english.

app.get('/', (_req, res) => res.redirect('/docs/pt')) // Redirect from "/" to "/docs/pt"
app.get('/docs', (_req, res) => res.redirect('/docs/pt')) // Redirect from "/docs" to "/docs/pt"

app.use(errorHandler) // Receive errors when next(error) is called

export { app } // Export the app so it can be used in tests and the in the server.ts file
