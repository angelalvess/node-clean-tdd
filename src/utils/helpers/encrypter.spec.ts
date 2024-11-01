import { bcrypt } from "@/__mocks__/mock-bcrypt"
import { Encrypter } from "./encrypter"
import { MissingParamError } from "../errors"

const makeSut = () => {
  const sut = new Encrypter()
  return { sut }
}

describe("Encrypter", () => {
  it("Should return true if bcrypt return true", async () => {
    const { sut } = makeSut()
    const isValid = await sut.compare("any_value", "hashed_value")

    expect(isValid).toBe(true)
  })

  it("Should return false if bcrypt return false", async () => {
    const { sut } = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare("any_value", "hashed_value")

    expect(isValid).toBe(false)
  })

  it("Should call bcript if the right values", async () => {
    const { sut } = makeSut()
    await sut.compare("any_value", "hashed_value")

    expect(bcrypt.value).toBe("any_value")
    expect(bcrypt.hash).toBe("hashed_value")
  })

  it("Should throw if no params are provided", async () => {
    const { sut } = makeSut()

    expect(sut.compare()).rejects.toThrow(new MissingParamError("value"))
    expect(sut.compare("any_value")).rejects.toThrow(
      new MissingParamError("hash"),
    )
  })
})
