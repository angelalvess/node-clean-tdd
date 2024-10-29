import { MissingParamError } from "../errors/missing-param-error"
import { UnauthorizedError } from "../errors/unauthorized-error"
import { HttpResponse } from "../protocols/http"

export const badRequest = (paramName: string): HttpResponse => ({
  statusCode: 400,
  body: new MissingParamError(paramName),
})

export const serverError = (error: string): HttpResponse => ({
  statusCode: 500,
  body: error,
})

export const unauthorizedError = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
})
