import { serverError, badRequest } from "../helpers/http.helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class LoginRouter {
  route(httpRequest?: HttpRequest): HttpResponse {
    if (!httpRequest || !httpRequest.body)
      return serverError("internal server error")

    const { email, password } = httpRequest!.body!
    if (!email) return badRequest("email is missing")
    if (!password) return badRequest("password is missing")

    return { statusCode: 200 }
  }
}
