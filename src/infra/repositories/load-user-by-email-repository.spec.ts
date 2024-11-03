import { Collection, MongoClient, Document, Db } from "mongodb"

class LoadUserByEmailRepository {
  constructor(private readonly userModel: Collection<Document>) {}

  async load(email: string) {
    const user = await this.userModel.findOne({ email })
    return user ? user : null
  }
}

describe("LoadUserByEmail Repository", () => {
  let client: MongoClient
  let db: Db

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {})
    db = await client.db()
  })

  afterAll(async () => {
    await client.close()
  })

  it("Should return null if no user is found ", async () => {
    const userModel = db.collection("users")
    const sut = new LoadUserByEmailRepository(userModel)
    const user = await sut.load("invalid_email@gmail.com")
    expect(user).toBeNull()
  })

  it("Should return an user if user is found ", async () => {
    const userModel = db.collection("users")
    await userModel.insertOne({ email: "valid_email@gmail.com" })
    const sut = new LoadUserByEmailRepository(userModel)
    const user = await sut.load("valid_email@gmail.com")
    expect(user!.email).toBe("valid_email@gmail.com")
  })
})
