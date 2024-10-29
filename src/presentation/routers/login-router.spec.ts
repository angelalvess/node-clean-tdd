type HttpRequest = {
  body?: {
    email?: string
    password?: string
  }
}

type HttpResponse = {
  statusCode: number
}

class LoginRouter {
  route(httpRequest?: HttpRequest): HttpResponse {
    if (!httpRequest || !httpRequest.body) {
      return {
        statusCode: 500,
      }
    }

    const { email, password } = httpRequest!.body!
    if (!email || !password) {
      return { statusCode: 400 }
    }

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
