import { ITokenGenerator } from "@/domain/protocols/index"
import { MissingParamError } from "../errors"
class TokenGenerator implements ITokenGenerator {
  async generate(userId?: string) {
    if (!userId) {
      throw new MissingParamError("id")
    }
    return null
  }
}

describe("Token Generator", () => {
  it("Should return null if JWT returns null", async () => {
    const sut = new TokenGenerator()
    const token = await sut.generate("any_id")
    expect(token).toBeNull()
  })

  it("Should throw if no params is provided", () => {
    const sut = new TokenGenerator()
    expect(sut.generate()).rejects.toThrow(new MissingParamError("id"))
  })
})
