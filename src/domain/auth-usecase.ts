import { MissingParamError } from "@/utils/errors"
import {
  IAuthUseCase,
  IEncrypter,
  ILoadUserByEmailRepository,
  ITokenGenerator,
  IUpdateAccessTokenRepository,
} from "./protocols"

type AuthUseCaseParams = {
  loadUserByEmailRepository?: ILoadUserByEmailRepository
  updateAccessTokenRepository: IUpdateAccessTokenRepository
  encrypter?: IEncrypter
  tokenGenerator?: ITokenGenerator
}

export class AuthUseCase implements IAuthUseCase {
  constructor(
    private readonly dependencies: AuthUseCaseParams = {} as AuthUseCaseParams,
  ) {}

  async auth(email?: string, password?: string): Promise<string | null | void> {
    const {
      loadUserByEmailRepository,
      encrypter,
      tokenGenerator,
      updateAccessTokenRepository,
    } = this.dependencies

    if (!email) {
      throw new MissingParamError("email")
    }
    if (!password) {
      throw new MissingParamError("password")
    }

    const user = await loadUserByEmailRepository!.load!(email)

    const isValid =
      user && (await encrypter!.compare!(password, user.password!))

    if (isValid) {
      const accessToken = await tokenGenerator!.generate!(user.id!)
      await updateAccessTokenRepository.update(user.id!, accessToken!)
      return accessToken
    }
    return null
  }
}
