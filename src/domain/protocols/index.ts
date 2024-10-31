export interface IAuthUseCase {
  auth?(email: string, password: string): Promise<string | null | void>
}

export interface User {
  password?: string
}
export interface ILoadUserByEmailRepository {
  load?(email: string): Promise<User | null>
}

export interface IEncrypterSpy {
  compare(password: string, hashPassword: string): Promise<boolean>
}
