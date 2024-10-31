import { MissingParamError } from "@/utils/errors"
import { AuthUseCase } from "./auth-usecase"
import {
  IEncrypter,
  ILoadUserByEmailRepository,
  ITokenGenerator,
  User,
} from "./protocols"

const makeEncrypter = () => {
  class EncrypterSpy implements IEncrypter {
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
    user!: User | null
    email!: string

    async load(email: string): Promise<User | null> {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    password: "hashed",
    id: "any_id",
  }
  return loadUserByEmailRepositorySpy
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy implements ITokenGenerator {
    userId!: string
    accessToken!: string | null

    async generate(userId: string) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = "any_token"
  return tokenGeneratorSpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase(
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
  )

  return { sut, loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy }
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

  // it("Should throw if  LoadUserByEmailRepository has no passed", async () => {
  //   const { encrypterSpy, tokenGeneratorSpy } = makeSut()
  //   const sut = new AuthUseCase({}, encrypterSpy, tokenGeneratorSpy)
  //   const promise = sut.auth("any_email@gmail.com", "any_password")

  //   expect(promise).rejects.toThrow()
  // })

  it("Should throw if  LoadUserByEmailRepository has no load method", async () => {
    const { encrypterSpy, tokenGeneratorSpy } = makeSut()
    const sut = new AuthUseCase({}, encrypterSpy, tokenGeneratorSpy)
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow()
  })

  it("Should return null if invalid email is provided", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth(
      "invalid_email@gmail.com",
      "any_password",
    )

    expect(accessToken).toBeNull()
  })

  it("Should return null if invalid password is provided", async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth(
      "valid_email@gmail.com",
      "invalid_password",
    )

    expect(accessToken).toBeNull()
  })

  it("Should call Encrypter with correct values", async () => {
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth("any_email@gmail.com", "any_password")

    expect(encrypterSpy.password).toBe("any_password")
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user?.password,
    )
  })

  it("Should call TokenGenerator with correct UserId", async () => {
    const { sut, tokenGeneratorSpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth("valid_email@gmail.com", "valid_password")

    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user?.id)
  })

  it("Should return an accessToken if correct credentials are provided", async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth(
      "valid_email@gmail.com",
      "valid_password",
    )

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })
})
