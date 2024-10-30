import { IAuthUseCase } from "@/presentation/routers/login-router"
import { MissingParamError } from "@/utils/errors"

interface ILoadUserByEmailRepository {
  load(email: string): Promise<void>
}
class AuthUseCase implements IAuthUseCase {
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

    await this.loadUserByEmailRepository?.load(email)
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    email!: string
    async load(email: string) {
      this.email = email
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()

  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
  return { sut, loadUserByEmailRepositorySpy }
}

describe("Auth Usecase", () => {
  it("Should throw if no email is provided", async () => {
    const { sut } = makeSut()

    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError("email"))
  })

  it("Should throw if no password is provided", async () => {
    const { sut } = makeSut()

    const promise = sut.auth("any_email@gmail.com")
    expect(promise).rejects.toThrow(new MissingParamError("password"))
  })

  it("Should call LoadUserByEmailRepository with correct email", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth("any_email@gmail.com", "any_password")
    expect(loadUserByEmailRepositorySpy.email).toBe("any_email@gmail.com")
  })
})
