import { MissingParamError } from "@/utils/errors"
import { IAuthUseCase } from "./protocols"

interface ILoadUserByEmailRepository {
  load?(email: string): Promise<object | null>
}

export class AuthUseCase implements IAuthUseCase {
  constructor(
    private readonly loadUserByEmailRepository: ILoadUserByEmailRepository,
  ) {}
  async auth(email?: string, password?: string): Promise<string | null | void> {
    if (!email) {
      throw new MissingParamError("email")
    }
    if (!password) {
      throw new MissingParamError("password")
    }

    const user = await this.loadUserByEmailRepository?.load!(email)
    if (!user) {
      return null
    }
    return null
  }
}
