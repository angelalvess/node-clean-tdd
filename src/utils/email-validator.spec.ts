class EmailValidator {
  isValid(email: string): boolean {
    console.log(`The email is ${email}`)
    return true
  }
}

describe("Email Validator", () => {
  test("Should return true if validator returns true", () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid("angelalves@gmail.com")
    expect(isEmailValid).toBe(true)
  })
})
