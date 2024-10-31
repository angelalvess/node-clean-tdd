import { MissingParamError } from "@/utils/errors"
import {
  IAuthUseCase,
  IEncrypterSpy,
  ILoadUserByEmailRepository,
} from "./protocols"

export class AuthUseCase implements IAuthUseCase {
  constructor(
    private readonly loadUserByEmailRepository: ILoadUserByEmailRepository,
    private readonly encrypterSpy: IEncrypterSpy,
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
    await this.encrypterSpy.compare(password, user.password!)

    return null
  }
}
