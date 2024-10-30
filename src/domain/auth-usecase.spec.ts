import { InvalidParamError, MissingParamError } from "@/utils/errors"
import { AuthUseCase } from "./auth-usecase"

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
