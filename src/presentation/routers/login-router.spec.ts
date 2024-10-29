import { badRequest, serverError } from "../helpers/http.helper"
import { HttpResponse } from "../protocols/http"

type HttpRequest = {
  body?: {
    email?: string
    password?: string
  }
}

class LoginRouter {
  route(httpRequest?: HttpRequest): HttpResponse {
    if (!httpRequest || !httpRequest.body)
      return serverError("internal server error")

    const { email, password } = httpRequest!.body!
    if (!email) return badRequest("email is missing")
    if (!password) return badRequest("password is missing")

    return { statusCode: 200 }
  }
}

describe("Login Router", () => {
  it("Should return 400 if no email is provided", () => {
    const sut = new LoginRouter()
    const httpRequest: HttpRequest = {
      body: {
        password: "123",
      },
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toBe("email is missings")
  })

  it("Should return 400 if no password is provided", () => {
    const sut = new LoginRouter()
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
    const sut = new LoginRouter()
    const httpRequest: HttpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
  it("Should return 500 if no httpRequest is provided", () => {
    const sut = new LoginRouter()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })
})
