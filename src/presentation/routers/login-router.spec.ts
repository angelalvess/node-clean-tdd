import { HttpRequest } from "../protocols/http"
import { LoginRouter } from "./login-router"

const makeSut = () => {
  return new LoginRouter()
}

describe("Login Router", () => {
  it("Should return 400 if no email is provided", () => {
    const sut = makeSut()

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
    const sut = makeSut()

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
    const sut = makeSut()

    const httpRequest: HttpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it("Should return 500 if no httpRequest is provided", () => {
    const sut = makeSut()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toBe("internal server error")
  })
})
