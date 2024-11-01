import { MissingParamError } from "@/utils/errors"
import { AuthUseCase } from "./auth-usecase"
import {
  IEncrypter,
  ILoadUserByEmailRepository,
  User,
  ITokenGenerator,
  IUpdateAccessTokenRepository,
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

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare() {
      throw new Error()
    }
  }

  return new EncrypterSpy()
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

const makeUpdateAcessTokenRepository = () => {
  class UpdateAcessTokenRepositorySpy implements IUpdateAccessTokenRepository {
    userId!: string
    acessToken!: string

    async update(userId: string, acessToken: string) {
      this.userId = userId
      this.acessToken = acessToken
    }
  }

  return new UpdateAcessTokenRepositorySpy()
}

const makeUpdateAcessTokenRepositoryWithError = () => {
  class UpdateAcessTokenRepositorySpy {
    async update() {
      throw new Error()
    }
  }

  return new UpdateAcessTokenRepositorySpy()
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load() {
      throw new Error()
    }
  }
  return new LoadUserByEmailRepositorySpy()
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

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate() {
      throw new Error()
    }
  }

  return new TokenGeneratorSpy()
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAccessTokenRepositorySpy = makeUpdateAcessTokenRepository()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy,
  }
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

  it("Shound throw if no dependencies are provided", async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth("any_email@gmail.com", "any_password")
    expect(promise).rejects.toThrow()
  })

  it("Should throw if no LoadUserByEmailRepository is provided", async () => {
    const { encrypterSpy, tokenGeneratorSpy, updateAccessTokenRepositorySpy } =
      makeSut()
    const sut = new AuthUseCase({
      updateAccessTokenRepository: updateAccessTokenRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy,
    })
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow()
  })

  it("Should throw if LoadUserByEmailRepository has no load method", async () => {
    const { encrypterSpy, tokenGeneratorSpy, updateAccessTokenRepositorySpy } =
      makeSut()
    const sut = new AuthUseCase({
      updateAccessTokenRepository: updateAccessTokenRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy,
      loadUserByEmailRepository: {},
    })
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow()
  })

  it("Should throw if no Encrypter is provided", async () => {
    const sut = new AuthUseCase({
      updateAccessTokenRepository: makeUpdateAcessTokenRepository(),
      loadUserByEmailRepository: makeLoadUserByEmailRepository(),
      tokenGenerator: makeTokenGenerator(),
    })
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow()
  })

  it("Should throw if Encrypter has no compare method", async () => {
    const sut = new AuthUseCase({
      encrypter: {},
      updateAccessTokenRepository: makeUpdateAcessTokenRepository(),
      tokenGenerator: makeTokenGenerator(),
      loadUserByEmailRepository: makeLoadUserByEmailRepository(),
    })
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow()
  })

  it("Should throw if no TokenGenerator is provided", async () => {
    const sut = new AuthUseCase({
      encrypter: makeEncrypter(),
      updateAccessTokenRepository: makeUpdateAcessTokenRepository(),
      loadUserByEmailRepository: makeLoadUserByEmailRepository(),
    })
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow()
  })

  it("Should throw if TokenGenerator has no generate method", async () => {
    const sut = new AuthUseCase({
      encrypter: makeEncrypter(),
      updateAccessTokenRepository: makeUpdateAcessTokenRepository(),
      tokenGenerator: {},
      loadUserByEmailRepository: makeLoadUserByEmailRepository(),
    })
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow()
  })

  it("Should throw if no UpdateAccessTokenRepository is provided", async () => {
    const sut = new AuthUseCase({
      encrypter: makeEncrypter(),
      tokenGenerator: makeTokenGenerator(),
      loadUserByEmailRepository: makeLoadUserByEmailRepository(),
    })
    const promise = sut.auth("any_email@gmail.com", "any_password")

    expect(promise).rejects.toThrow()
  })

  it("Should throw if UpdateAccessTokenRepository has no update method", async () => {
    const sut = new AuthUseCase({
      encrypter: makeEncrypter(),
      updateAccessTokenRepository: {},
      tokenGenerator: makeTokenGenerator(),
      loadUserByEmailRepository: makeLoadUserByEmailRepository(),
    })
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

  it("Should calls UpdateAcessTokenRepository with the correct values", async () => {
    const {
      sut,
      loadUserByEmailRepositorySpy,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy,
    } = makeSut()
    await sut.auth("valid_email@gmail.com", "valid_password")
    expect(updateAccessTokenRepositorySpy.userId).toBe(
      loadUserByEmailRepositorySpy.user?.id,
    )
    expect(updateAccessTokenRepositorySpy.acessToken).toBe(
      tokenGeneratorSpy.accessToken,
    )
  })

  it("Should throw if LoadUserByEmailRepository throws", async () => {
    const loadUserByEmailRepositorySpy =
      makeLoadUserByEmailRepositoryWithError()
    const sut = new AuthUseCase({
      updateAccessTokenRepository: makeUpdateAcessTokenRepository(),
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: makeEncrypter(),
      tokenGenerator: makeTokenGenerator(),
    })
    const promise = sut.auth("any_email@gmail.com", "any_password")
    expect(promise).rejects.toThrow()
  })

  it("Should throw if Encrypter throws", async () => {
    const encrypterSpy = makeEncrypterWithError()
    const sut = new AuthUseCase({
      updateAccessTokenRepository: makeUpdateAcessTokenRepository(),
      loadUserByEmailRepository: makeLoadUserByEmailRepository(),
      encrypter: encrypterSpy,
      tokenGenerator: makeTokenGenerator(),
    })
    const promise = sut.auth("any_email@gmail.com", "any_password")
    expect(promise).rejects.toThrow()
  })

  it("Should throw if TokenGenerator throws", async () => {
    const tokenGeneratorSpy = makeTokenGeneratorWithError()
    const sut = new AuthUseCase({
      updateAccessTokenRepository: makeUpdateAcessTokenRepository(),
      loadUserByEmailRepository: makeLoadUserByEmailRepository(),
      encrypter: makeEncrypter(),
      tokenGenerator: tokenGeneratorSpy,
    })
    const promise = sut.auth("any_email@gmail.com", "any_password")
    expect(promise).rejects.toThrow()
  })

  it("Should throw if UpdateAccessTokenRepository throws", async () => {
    const makeUpdateAcessTokenRepositorySpy =
      makeUpdateAcessTokenRepositoryWithError()
    const sut = new AuthUseCase({
      updateAccessTokenRepository: makeUpdateAcessTokenRepositorySpy,
      loadUserByEmailRepository: makeLoadUserByEmailRepository(),
      encrypter: makeEncrypter(),
      tokenGenerator: makeTokenGenerator(),
    })

    const promise = sut.auth("any_email@gmail.com", "any_password")
    expect(promise).rejects.toThrow()
  })
})
