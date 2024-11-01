export interface IEncrypt {
  compare(value?: string, hash?: string): Promise<boolean>
}

export interface IEmailValidator {
  isValid(email: string): boolean
}
