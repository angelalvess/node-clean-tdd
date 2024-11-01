class Encrypter {
  async compare() {
    return true
  }
}

describe("Encrypter", () => {
  it("Should return true if bcrypt return true", async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare()
    expect(isValid).toBe(true)
  })
})
