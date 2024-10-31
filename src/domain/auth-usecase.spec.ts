import { MissingParamError } from "@/utils/errors"
import { AuthUseCase } from "./auth-usecase"
import { IEncrypterSpy, ILoadUserByEmailRepository } from "./protocols"

const makeEncrypter = () => {
  class EncrypterSpy implements IEncrypterSpy {
    password!: string
    hashedPassword!: string
    isValid!: boolean

    async compare(password: string, hashPassword: string) {
      this.password = password
      this.hashedPassword = hashPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy implements ILoadUserByEmailRepository {
    user!: { password: string } | null
    email!: string

    async load(email: string) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    password: "hashed",
  }
  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy)

  return { sut, loadUserByEmailRepositorySpy, encrypterSpy }
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

  it("Should throw if  LoadUserByEmailRepository has no load method", async () => {
    const { encrypterSpy } = makeSut()
    const sut = new AuthUseCase({}, encrypterSpy)
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow()
  })

  it("Should return null if invalid email is provided", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const acessToken = await sut.auth("invalid_email@gmail.com", "any_password")

    expect(acessToken).toBeNull()
  })

  it("Should return null if invalid password is provided", async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const acessToken = await sut.auth(
      "valid_email@gmail.com",
      "invalid_password",
    )

    expect(acessToken).toBeNull()
  })

  it("Should call Encrypter with correct values", async () => {
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth("any_email@gmail.com", "any_password")

    expect(encrypterSpy.password).toBe("any_password")
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user?.password,
    )
  })
})
