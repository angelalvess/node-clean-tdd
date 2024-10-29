import {
  serverError,
  badRequest,
  unauthorizedError,
  ok,
} from "../helpers/http.helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

interface AuthUseCase {
  auth?(email: string, password: string): null | string
}

export class LoginRouter {
  constructor(private readonly authUseCase?: AuthUseCase) {}

  route(httpRequest?: HttpRequest): HttpResponse {
    if (
      !httpRequest ||
      !httpRequest.body ||
      !this.authUseCase ||
      !this.authUseCase.auth
    )
      return serverError("internal server error")

    const { email, password } = httpRequest!.body!
    if (!email) return badRequest("email")
    if (!password) return badRequest("password")

    const acessToken = this.authUseCase!.auth(email, password)
    if (!acessToken) {
      return unauthorizedError()
    }

    return ok()
  }
}
