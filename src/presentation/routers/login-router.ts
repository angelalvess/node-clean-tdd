import { IAuthUseCase } from "@/domain/protocols"
import { MissingParamError, InvalidParamError } from "../../utils/errors"
import { badRequest, serverError, unauthorizedError, ok } from "../helpers"
import { HttpRequest, HttpResponse } from "../protocols"

export interface IEmailValidator {
  isValid?(email: string): boolean | void
}
export class LoginRouter {
  constructor(
    private readonly authUseCase: IAuthUseCase,
    private readonly emailValidator: IEmailValidator,
  ) {}

  async route(httpRequest?: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest!.body!

      if (!email) return badRequest(new MissingParamError("email"))

      if (!this.emailValidator.isValid!(email)) {
        return badRequest(new InvalidParamError("email"))
      }

      if (!password) return badRequest(new MissingParamError("password"))

      const accessToken = await this.authUseCase.auth!(email, password)
      if (!accessToken) {
        return unauthorizedError()
      }

      return ok(accessToken)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
