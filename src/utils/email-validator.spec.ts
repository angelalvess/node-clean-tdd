import validator from "validator"

class EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}

const makeSut = () => {
  return new EmailValidator()
}

describe("Email Validator", () => {
  it("Should return true if validator returns true", () => {
    const sut = makeSut()

    const isEmailValid = sut.isValid("angelalves@gmail.com")
    expect(isEmailValid).toBe(true)
  })

  it("Should return false if validator returns false", () => {
    const sut = makeSut()

    const isEmailValid = sut.isValid("invalid_email")
    expect(isEmailValid).toBe(false)
  })
})
