import { UnauthorizedError } from "../errors/unauthorized-error"
import { HttpResponse } from "../protocols/http"

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const serverError = (error: string): HttpResponse => ({
  statusCode: 500,
  body: error,
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
})
