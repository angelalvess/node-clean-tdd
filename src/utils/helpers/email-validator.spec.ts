import { EmailValidator } from "./email-validator"
import { validator } from "../../__mocks__/mock-validator"
import { MissingParamError } from "../errors"

const makeSut = () => {
  return new EmailValidator()
}

describe("Email Validator", () => {
  it("Should return true if validator returns true", () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid("valid_email@gmail.com")

    expect(isEmailValid).toBe(true)
  })

  it("Should return false if validator returns false", () => {
    const sut = makeSut()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid("invalid_email@gmail.com")

    expect(isEmailValid).toBe(false)
  })

  it("Should call validator with correct email", () => {
    const sut = makeSut()
    sut.isValid("any_email@gmail.com")

    expect(validator.email).toBe("any_email@gmail.com")
  })

  it("Should throw if no email is provided", () => {
    const sut = makeSut()

    expect(sut.isValid).toThrow(new MissingParamError("email"))
  })
})
