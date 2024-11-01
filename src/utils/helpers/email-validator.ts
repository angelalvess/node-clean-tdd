import { validator } from "../../__mocks__/mock-validator"
import { IEmailValidator } from "../protocols"

export class EmailValidator implements IEmailValidator {
  email?: string

  isValid(email: string) {
    this.email = email
    return validator.isEmail(email)
  }
}
