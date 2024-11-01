import { MissingParamError } from "../errors"
import { jwt } from "@/__mocks__/mock-jsonwebtoken"
import { TokenGenerator } from "./token-generator"

const makeSut = () => {
  const sut = new TokenGenerator("secret")
  return { sut }
}

describe("Token Generator", () => {
  it("Should return null if JWT returns null", async () => {
    const { sut } = makeSut()
    jwt.token = null
    const token = await sut.generate("any_id")
    expect(token).toBeNull()
  })

  it("Should throw if no secret is provided", async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate("any_id")

    expect(promise).rejects.toThrow(new MissingParamError("secret"))
  })

  it("Should throw if no id is provided", async () => {
    const { sut } = makeSut()
    const promise = sut.generate()

    expect(promise).rejects.toThrow(new MissingParamError("id"))
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

  it("Should call JWT with correct values", async () => {
    const { sut } = makeSut()
    await sut.generate("any_id")
    expect(jwt.id).toBe("any_id")
    expect(jwt.secret).toBe(sut.secret)
  })
})
