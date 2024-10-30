import validator from "validator"

class EmailValidator {
  email?: string

  isValid(email: string): boolean {
    this.email = email
    return validator.isEmail(email)
  }
}

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

    const isEmailValid = sut.isValid("invalid_email")
    expect(isEmailValid).toBe(false)
  })

  it("Should call validator with correct email", () => {
    const sut = makeSut()

    sut.isValid("any_email@gmail.com")
    expect(sut.email).toBe("any_email@gmail.com")
  })
})
