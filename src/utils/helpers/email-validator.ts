import { validator } from "../../__mocks__/mock-validator"

export class EmailValidator {
  email?: string

  isValid(email: string): boolean {
    this.email = email
    return validator.isEmail(email)
  }
}
