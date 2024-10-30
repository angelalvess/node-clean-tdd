import { IAuthUseCase } from "@/presentation/routers/login-router"
import { MissingParamError, InvalidParamError } from "@/utils/errors"

interface ILoadUserByEmailRepository {
  load?(email: string): Promise<void | null>
}

export class AuthUseCase implements IAuthUseCase {
  constructor(
    private readonly loadUserByEmailRepository?: ILoadUserByEmailRepository,
  ) {}
  async auth(email?: string, password?: string): Promise<string | null | void> {
    if (!email) {
      throw new MissingParamError("email")
    }
    if (!password) {
      throw new MissingParamError("password")
    }

    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError("loadUserByEmailRepository")
    }
    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError("loadUserByEmailRepository")
    }

    const user = await this.loadUserByEmailRepository?.load!(email)
    if (!user) {
      return null
    }
  }
}
