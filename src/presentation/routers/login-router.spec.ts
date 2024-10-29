import { MissingParamError } from "../errors/missing-param-error"

import { UnauthorizedError } from "../errors/unauthorized-error"

import { HttpRequest } from "../protocols/http"
import { LoginRouter } from "./login-router"

const makeSut = () => {
  class AuthUseCaseSpy {
    email!: string
    password!: string
    acessToken!: null | string

    auth(email: string, password: string) {
      this.email = email
      this.password = password
      return this.acessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.acessToken = "validtoken"

  const sut = new LoginRouter(authUseCaseSpy)
  return { sut, authUseCaseSpy }
}

describe("Login Router", () => {
  it("Should return 400 if no email is provided", () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        password: "any_password",
      },
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("email"))
  })

  it("Should return 400 if no password is provided", () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: "any_email@gmail.com",
      },
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("password"))
  })

  it("Should return 500 if no body is provided", () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it("Should return 500 if no httpRequest is provided", () => {
    const { sut } = makeSut()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  it("Should call AuthUseCase with correct params ", () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: "any_email@gmail.com",
        password: "any_password",
      },
    }
    sut.route(httpRequest)

    expect(authUseCaseSpy.email).toBe(httpRequest.body?.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body?.password)
  })

  it("Should return 401 when invalid credentials are provided", () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.acessToken = null

    const httpRequest: HttpRequest = {
      body: {
        email: "invalid_email@gmail.com",
        password: "invalid_password",
      },
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it("Should return 200 when valid credentials are provided", () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: "valid_email@gmail.com",
        password: "valid_password",
      },
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })
})

it("Should return 500 if no AuthUseCase is provided", () => {
  const sut = new LoginRouter()

  const httpRequest: HttpRequest = {
    body: {
      email: "any_email@gmail.com",
      password: "any_password",
    },
  }
  const httpResponse = sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
})

it("Should return 500 if  AuthUseCase has no auth", () => {
  class AuthUseCase {}
  const authUseCase = new AuthUseCase()

  const sut = new LoginRouter(authUseCase)

  const httpRequest: HttpRequest = {
    body: {
      email: "any_email@gmail.com",
      password: "any_password",
    },
  }

  const httpResponse = sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
})
