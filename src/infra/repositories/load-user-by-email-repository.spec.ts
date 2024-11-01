import { ILoadUserByEmailRepository } from "@/domain/protocols"

class LoadUserByEmailRepository implements ILoadUserByEmailRepository {
  async load(email: string) {
    if (!email) return null
    return null
  }
}

describe("LoadUserByEmail Repository", () => {
  it("Should return null if no user is found ", async () => {
    const sut = new LoadUserByEmailRepository()
    const user = await sut.load("invalid_email@gmail.com")
    expect(user).toBeNull()
  })
})
