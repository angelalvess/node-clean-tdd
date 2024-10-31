import { MissingParamError } from "@/utils/errors"
import {
  IAuthUseCase,
  IEncrypter,
  ILoadUserByEmailRepository,
  ITokenGenerator,
} from "./protocols"

export class AuthUseCase implements IAuthUseCase {
  constructor(
    private readonly loadUserByEmailRepository: ILoadUserByEmailRepository,
    private readonly encrypter: IEncrypter,
    private readonly tokenGenerator: ITokenGenerator,
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

    const isValid = await this.encrypter.compare(password, user.password!)
    if (!isValid) {
      return null
    }

    await this.tokenGenerator.generate(user.id!)
  }
}
