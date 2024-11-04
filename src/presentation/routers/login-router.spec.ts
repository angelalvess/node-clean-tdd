import { UnauthorizedError } from "../errors/unauthorized-error"
import { HttpRequest } from "../protocols/http"
import { LoginRouter } from "./login-router"
import { ServerError } from "../errors/server-error"
import { InvalidParamError, MissingParamError } from "../../utils/errors"
import { IAuthUseCase } from "@/domain/protocols"
import { IEmailValidator } from "@/utils/protocols"

const makeAuthUseCase = () => {
  class AuthUseCaseSpy implements IAuthUseCase {
    email!: string
    password!: string
    accessToken!: null | string

    async auth(email: string, password: string) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = "valid_token"
  return authUseCaseSpy
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy implements IAuthUseCase {
    async auth() {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

const makeEmailValidator = () => {
  class EmailValidatorSpy implements IEmailValidator {
    isValidEmail!: boolean
    email!: string

    isValid(email: string) {
      this.email = email
      return this.isValidEmail
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isValidEmail = true
  return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy implements IEmailValidator {
    isValid() {
      throw new Error()
    }
  }
  return new EmailValidatorSpy()
}
const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()

  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
  return { sut, authUseCaseSpy, emailValidatorSpy }
}

describe("Login Router", () => {
  it("Should return 200 when valid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: "valid_email@gmail.com",
        password: "valid_password",
      },
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(authUseCaseSpy.accessToken)
  })
})

it("Should return 400 if no email is provided", async () => {
  const { sut } = makeSut()

  const httpRequest: HttpRequest = {
    body: {
      password: "any_password",
    },
  }
  const httpResponse = await sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingParamError("email"))
})

it("Should return 400 if no password is provided", async () => {
  const { sut } = makeSut()

  const httpRequest: HttpRequest = {
    body: {
      email: "any_email@gmail.com",
    },
  }
  const httpResponse = await sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingParamError("password"))
})

it("Should return 400 if a invalid email is provided", async () => {
  const { sut, emailValidatorSpy } = makeSut()
  emailValidatorSpy.isValidEmail = false

  const httpRequest: HttpRequest = {
    body: {
      email: "invalid_email@gmail.com",
      password: "any_password",
    },
  }
  const httpResponse = await sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidParamError("email"))
})

it("Should return 401 when invalid credentials are provided", async () => {
  const { sut, authUseCaseSpy } = makeSut()
  authUseCaseSpy.accessToken = null

  const httpRequest: HttpRequest = {
    body: {
      email: "invalid_email@gmail.com",
      password: "invalid_password",
    },
  }
  const httpResponse = await sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(401)
  expect(httpResponse.body).toEqual(new UnauthorizedError())
})

it("Should return 500 if no body is provided", async () => {
  const { sut } = makeSut()

  const httpRequest: HttpRequest = {}
  const httpResponse = await sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new ServerError())
})

it("Should return 500 if no httpRequest is provided", async () => {
  const { sut } = makeSut()

  const httpResponse = await sut.route()
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new ServerError())
})

it("Should return 500 if  EmailValidator has no isValid method", async () => {
  const authUseCaseSpy = makeAuthUseCase()
  const sut = new LoginRouter(authUseCaseSpy, {})

  const httpRequest: HttpRequest = {
    body: {
      email: "any_email@gmail.com",
      password: "any_password",
    },
  }
  const httpResponse = await sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new ServerError())
})

it("Should return 500 if EmailValidator throws", async () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidatorWithError()

  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  const httpRequest: HttpRequest = {
    body: {
      email: "any_email@gmail.com",
      password: "any_password",
    },
  }
  const httpResponse = await sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new ServerError())
})

it("Should return 500 if AuthUseCase throws", async () => {
  const authUseCaseSpy = makeAuthUseCaseWithError()
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  const httpRequest: HttpRequest = {
    body: {
      email: "any_email@gmail.com",
      password: "any_password",
    },
  }
  const httpResponse = await sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new ServerError())
})

it("Should return 500 if  AuthUseCase has no auth", async () => {
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginRouter({}, emailValidatorSpy)

  const httpRequest: HttpRequest = {
    body: {
      email: "any_email@gmail.com",
      password: "any_password",
    },
  }

  const httpResponse = await sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
})

it("Should call AuthUseCase with correct params ", async () => {
  const { sut, authUseCaseSpy } = makeSut()
  const httpRequest: HttpRequest = {
    body: {
      email: "any_email@gmail.com",
      password: "any_password",
    },
  }
  await sut.route(httpRequest)

  expect(authUseCaseSpy.email).toBe(httpRequest.body?.email)
  expect(authUseCaseSpy.password).toBe(httpRequest.body?.password)
})

it("Should call EmailValidator with correct params ", async () => {
  const { sut, emailValidatorSpy } = makeSut()
  const httpRequest: HttpRequest = {
    body: {
      email: "any_email@gmail.com",
      password: "any_password",
    },
  }
  await sut.route(httpRequest)

  expect(emailValidatorSpy.email).toBe(httpRequest.body?.email)
})
