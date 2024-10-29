import { serverError, badRequest } from "../helpers/http.helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

interface AuthUseCase {
  auth(email: string, password: string): void
}

export class LoginRouter {
  constructor(private readonly authUseCase: AuthUseCase) {}

  route(httpRequest?: HttpRequest): HttpResponse {
    if (!httpRequest || !httpRequest.body)
      return serverError("internal server error")

    const { email, password } = httpRequest!.body!
    if (!email) return badRequest("email is missing")
    if (!password) return badRequest("password is missing")

    this.authUseCase.auth(email, password)

    return { statusCode: 401 }
  }
}
