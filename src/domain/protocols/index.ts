export interface IAuthUseCase {
  auth?(email: string, password: string): Promise<string | null | void>
}

export interface User {
  password?: string
  id?: string
}
export interface ILoadUserByEmailRepository {
  load?(email: string): Promise<User | null | void>
}

export interface IEncrypter {
  compare?(password: string, hashPassword: string): Promise<boolean | void>
}

export interface ITokenGenerator {
  generate?(userId: string): Promise<string | null | void>
}

export interface IUpdateAccessTokenRepository {
  update(userId: string, acessToken: string): Promise<void>
}
