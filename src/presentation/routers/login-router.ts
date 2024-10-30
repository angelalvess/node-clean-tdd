import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import {
  serverError,
  badRequest,
  unauthorizedError,
  ok,
} from "../helpers/http.helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

export interface IAuthUseCase {
  auth?(email: string, password: string): Promise<string | null | void>
}

export interface IEmailValidator {
  isValid?(email: string): boolean | void
}
export class LoginRouter {
  constructor(
    private readonly authUseCase?: IAuthUseCase,
    private readonly emailValidator?: IEmailValidator,
  ) {}

  async route(httpRequest?: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest!.body!

      if (!email) return badRequest(new MissingParamError("email"))

      if (!this.emailValidator!.isValid!(email)) {
        return badRequest(new InvalidParamError("email"))
      }

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
