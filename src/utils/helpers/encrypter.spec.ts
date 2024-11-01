import { bcrypt } from "@/__mocks__/mock-bcrypt"

class Encrypter {
  async compare(value: string, hash: string) {
    const isValid = await bcrypt.compare(value, hash)

    return isValid
  }
}

describe("Encrypter", () => {
  it("Should return true if bcrypt return true", async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare("any_value", "hashed_value")

    expect(isValid).toBe(true)
  })

  it("Should return false if bcrypt return false", async () => {
    const sut = new Encrypter()
    bcrypt.isValid = false
    const isValid = await sut.compare("any_value", "hashed_value")

    expect(isValid).toBe(false)
  })

  it("Should call bcript if the right values", async () => {
    const sut = new Encrypter()
    await sut.compare("any_value", "hashed_value")

    expect(bcrypt.value).toBe("any_value")
    expect(bcrypt.hash).toBe("hashed_value")
  })
})
