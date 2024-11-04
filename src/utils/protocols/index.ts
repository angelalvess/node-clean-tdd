import { WithId, Document } from "mongodb"

export interface IEncrypt {
  compare(value?: string, hash?: string): Promise<boolean>
}

export interface IEmailValidator {
  isValid?(email: string): boolean | void
}
export interface User {
  password?: string
  id?: string
}
export interface ILoadUserByEmailRepository {
  load?(email: string): Promise<WithId<Document> | User | null | void>
}

export interface ITokenGenerator {
  generate?(userId: string): Promise<string | null | void>
}

export interface IUpdateAccessTokenRepository {
  update?(userId: string, accessToken: string): Promise<void>
}
