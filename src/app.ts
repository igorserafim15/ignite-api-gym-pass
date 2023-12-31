import fastify from 'fastify'
import { authenticateRoutes } from './http/controller/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(authenticateRoutes)

app.setErrorHandler((error, _, response) => {
  if (error instanceof ZodError) {
    return response
      .status(422)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return response.status(500).send({ message: 'Internal server error.' })
})
