export interface IAuthUseCase {
  auth?(email: string, password: string): Promise<string | null | void>
}

export interface User {
  password?: string
  id?: string
}
export interface ILoadUserByEmailRepository {
  load?(email: string): Promise<User | null>
}

export interface IEncrypter {
  compare?(password: string, hashPassword: string): Promise<boolean>
}

export interface ITokenGenerator {
  generate?(userId: string): Promise<string | null>
}
