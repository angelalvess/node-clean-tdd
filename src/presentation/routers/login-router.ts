import { MissingParamError } from "../errors/missing-param-error"
import {
  serverError,
  badRequest,
  unauthorizedError,
  ok,
} from "../helpers/http.helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

interface AuthUseCase {
  auth?(email: string, password: string): Promise<string | null | void>
}

export class LoginRouter {
  constructor(private readonly authUseCase?: AuthUseCase) {}

  async route(httpRequest?: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest!.body!
      if (!email) return badRequest(new MissingParamError("email"))
      if (!password) return badRequest(new MissingParamError("password"))

      const acessToken = await this.authUseCase!.auth!(email, password)
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
