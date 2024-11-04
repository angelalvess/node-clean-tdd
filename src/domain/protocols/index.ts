export interface IAuthUseCase {
  auth?(email: string, password: string): Promise<string | null | void>
}

export interface IEncrypter {
  compare?(password: string, hashPassword: string): Promise<boolean | void>
}
