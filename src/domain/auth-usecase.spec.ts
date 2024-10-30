import { IAuthUseCase } from "@/presentation/routers/login-router"

class AuthUseCase implements IAuthUseCase {
  async auth(email?: string): Promise<string | null | void> {
    if (!email) {
      throw new Error()
    }
  }
}

describe("Auth Usecase", () => {
  it("Should throw if no email is provided", async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth()
    expect(promise).rejects.toThrow()
  })
})
