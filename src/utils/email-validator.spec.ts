import { EmailValidator } from "./email-validator"

describe("Email Validator", () => {
  test("Should return true if validator returns true", () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid("angelalves@gmail.com")
    expect(isEmailValid).toBe(true)
  })
})
