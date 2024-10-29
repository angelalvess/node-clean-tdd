import {
  serverError,
  badRequest,
  unauthorizedError,
  ok,
} from "../helpers/http.helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

interface AuthUseCase {
  auth?(email: string, password: string): null | string | void
}

export class LoginRouter {
  constructor(private readonly authUseCase?: AuthUseCase) {}

  route(httpRequest?: HttpRequest): HttpResponse {
    try {
      const { email, password } = httpRequest!.body!
      if (!email) return badRequest("email")
      if (!password) return badRequest("password")

      const acessToken = this.authUseCase!.auth!(email, password)
      if (!acessToken) {
        return unauthorizedError()
      }

      return ok(acessToken)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
