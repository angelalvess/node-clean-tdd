import { Collection, MongoClient, Document, Db } from "mongodb"
import { beforeEach } from "node:test"

let client: MongoClient
let db: Db

class LoadUserByEmailRepository {
  constructor(private readonly userModel: Collection<Document>) {}

  async load(email: string) {
    const user = await this.userModel.findOne({ email })
    return user ? user : null
  }
}

const makeSut = () => {
  const userModel = db.collection("users")
  const sut = new LoadUserByEmailRepository(userModel)
  return { sut, userModel }
}

describe("LoadUserByEmail Repository", () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL as string, {})
    db = client.db()
  })

  beforeEach(async () => {
    await db.collection("users").deleteMany({})
  })

  afterAll(async () => {
    await client.close()
  })

  it("Should return null if no user is found ", async () => {
    const { sut } = makeSut()
    const user = await sut.load("invalid_email@gmail.com")
    expect(user).toBeNull()
  })

  it("Should return an user if user is found ", async () => {
    const { userModel, sut } = makeSut()
    await userModel.insertOne({ email: "valid_email@gmail.com" })
    const user = await sut.load("valid_email@gmail.com")
    expect(user!.email).toBe("valid_email@gmail.com")
  })
})
