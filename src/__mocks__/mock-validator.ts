export const validator = {
  isEmailValid: true,
  email: "",
  isEmail(email: string): boolean {
    this.email = email
    return this.isEmailValid
  },
}
