import { MissingParamError } from "../errors/missing-param-error"

import { UnauthorizedError } from "../errors/unauthorized-error"

import { HttpRequest } from "../protocols/http"
import { LoginRouter } from "./login-router"
import { ServerError } from "../errors/server-error"

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    email!: string
    password!: string
    acessToken!: null | string

    async auth(email: string, password: string) {
      this.email = email
      this.password = password
      return this.acessToken
    }
  }
  return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth() {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  authUseCaseSpy.acessToken = "validtoken"

  const sut = new LoginRouter(authUseCaseSpy)
  return { sut, authUseCaseSpy }
}

describe("Login Router", () => {
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

  it("Should return 401 when invalid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.acessToken = null

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
    expect(httpResponse.body).toEqual(authUseCaseSpy.acessToken)
  })
})

it("Should return 500 if no AuthUseCase is provided", async () => {
  const sut = new LoginRouter()

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
  const sut = new LoginRouter(authUseCaseSpy)

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
  class AuthUseCase {}
  const authUseCase = new AuthUseCase()

  const sut = new LoginRouter(authUseCase)

  const httpRequest: HttpRequest = {
    body: {
      email: "any_email@gmail.com",
      password: "any_password",
    },
  }

  const httpResponse = await sut.route(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
})
