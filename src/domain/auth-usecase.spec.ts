import { IAuthUseCase } from "@/presentation/routers/login-router"
import { InvalidParamError, MissingParamError } from "@/utils/errors"

interface ILoadUserByEmailRepository {
  load?(email: string): Promise<void | null>
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

  it("Should throw if no LoadUserByEmailRepository is provided", async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow(
      new MissingParamError("loadUserByEmailRepository"),
    )
  })

  it("Should throw if  LoadUserByEmailRepository has no load method", async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow(
      new InvalidParamError("loadUserByEmailRepository"),
    )
  })

  it("Should return null if LoadUserByEmailRepository return null", async () => {
    const { sut } = makeSut()
    const acessToken = await sut.auth("any_email@gmail.com", "any_password")

    expect(acessToken).toBeNull()
  })
})
