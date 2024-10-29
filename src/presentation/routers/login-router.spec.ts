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
  route(httpRequest: HttpRequest): HttpResponse {
    const { email, password } = httpRequest.body!
    if (!email) {
      return { statusCode: 400 }
    }
    if (!password) {
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
})
