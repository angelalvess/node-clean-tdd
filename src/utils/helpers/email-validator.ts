import { validator } from "../../__mocks__/mock-validator"
import { MissingParamError } from "../errors"
import { IEmailValidator } from "../protocols"

export class EmailValidator implements IEmailValidator {
  email?: string

  isValid(email?: string) {
    if (!email) {
      throw new MissingParamError("email")
    }
    this.email = email
    return validator.isEmail(email)
  }
}
