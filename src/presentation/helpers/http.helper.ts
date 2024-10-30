import { ServerError, UnauthorizedError } from "../errors"
import { HttpResponse } from "../protocols"

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
})

export const unauthorizedError = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
})

export const ok = (acessToken: string): HttpResponse => ({
  statusCode: 200,
  body: acessToken,
})
