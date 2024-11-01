import { MissingParamError } from "../errors"
import { jwt } from "@/__mocks__/mock-jsonwebtoken"
import { TokenGenerator } from "./token-generator"

const makeSut = () => {
  const sut = new TokenGenerator()
  return { sut }
}

describe("Token Generator", () => {
  it("Should return null if JWT returns null", async () => {
    const { sut } = makeSut()
    jwt.token = null
    const token = await sut.generate("any_id")
    expect(token).toBeNull()
  })

  it("Should throw if no params is provided", async () => {
    const { sut } = makeSut()
    expect(sut.generate()).rejects.toThrow(new MissingParamError("id"))
  })

  it("Should return a token if JWT returns a token", async () => {
    const { sut } = makeSut()
    const token = await sut.generate("any_id")
    expect(token).toBe(jwt.token)
  })
})
