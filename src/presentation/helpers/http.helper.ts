import { MissingParamError } from "../errors/missing-param-error"
import { ServerError } from "../errors/server-error"
import { UnauthorizedError } from "../errors/unauthorized-error"
import { HttpResponse } from "../protocols/http"

export const badRequest = (paramName: string): HttpResponse => ({
  statusCode: 400,
  body: new MissingParamError(paramName),
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
