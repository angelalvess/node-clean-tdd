import { HttpRequest } from "../protocols/http"
import { LoginRouter } from "./login-router"

const makeSut = () => {
  class AuthUseCase {
    email!: string
    auth(email: string) {
      this.email = email
    }
  }

  const authUseCase = new AuthUseCase()

  const sut = new LoginRouter(authUseCase)
  return { sut, authUseCase }
}

describe("Login Router", () => {
  it("Should return 400 if no email is provided", () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        password: "123",
      },
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBe("email is missing")
  })

  it("Should return 400 if no password is provided", () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: "angiealves@gmail.com",
      },
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBe("password is missing")
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
    expect(httpResponse.body).toBe("internal server error")
  })

  it("Should call AuthUseCase with correct params ", () => {
    const { sut, authUseCase } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: "angie@gmail.com",
        password: "123",
      },
    }
    sut.route(httpRequest)

    expect(authUseCase.email).toBe(httpRequest.body?.email)
  })
})
