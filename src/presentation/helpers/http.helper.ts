import { HttpResponse } from "../protocols/http"

export const badRequest = (error: string): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const serverError = (error: string): HttpResponse => ({
  statusCode: 500,
  body: error,
})
