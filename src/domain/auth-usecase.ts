import { MissingParamError } from "@/utils/errors"
import {
  IAuthUseCase,
  IEncrypter,
  ILoadUserByEmailRepository,
  ITokenGenerator,
} from "./protocols"

type AuthUseCaseParams = {
  loadUserByEmailRepository: ILoadUserByEmailRepository
  encrypter: IEncrypter
  tokenGenerator: ITokenGenerator
}

export class AuthUseCase implements IAuthUseCase {
  constructor(
    private readonly dependencies: AuthUseCaseParams = {} as AuthUseCaseParams,
  ) {}

  async auth(email?: string, password?: string): Promise<string | null | void> {
    const { loadUserByEmailRepository, encrypter, tokenGenerator } =
      this.dependencies

    if (!email) {
      throw new MissingParamError("email")
    }
    if (!password) {
      throw new MissingParamError("password")
    }

    const user = await loadUserByEmailRepository.load!(email)

    const isValid = user && (await encrypter.compare(password, user.password!))

    if (isValid) {
      const accessToken = await tokenGenerator.generate(user.id!)
      return accessToken
    }
    return null
  }
}
