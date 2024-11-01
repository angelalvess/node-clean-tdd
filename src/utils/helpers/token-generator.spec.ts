import { ITokenGenerator } from "@/domain/protocols/index"
import { MissingParamError } from "../errors"
import { jwt } from "@/__mocks__/mock-jsonwebtoken"
class TokenGenerator implements ITokenGenerator {
  async generate(id?: string) {
    if (!id) {
      throw new MissingParamError("id")
    }
    const token = await jwt.sign(id, "secret")
    return token
  }
}

describe("Token Generator", () => {
  it("Should return null if JWT returns null", async () => {
    const sut = new TokenGenerator()
    jwt.token = null
    const token = await sut.generate("any_id")
    expect(token).toBeNull()
  })

  it("Should throw if no params is provided", async () => {
    const sut = new TokenGenerator()
    expect(sut.generate()).rejects.toThrow(new MissingParamError("id"))
  })

  it("Should return a token if JWT returns a token", async () => {
    const sut = new TokenGenerator()
    const token = await sut.generate("any_id")
    expect(token).toBe(jwt.token)
  })
})
