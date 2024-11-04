import {
  MongoClient,
  Db,
  Collection,
  Document,
  Condition,
  ObjectId,
} from "mongodb"
import { beforeEach } from "node:test"
import { MongoHelper } from "../helpers/mongo-helper"

let client: MongoClient
let db: Db

class UpdateAccessTokenRepository {
  constructor(private readonly userModel?: Collection<Document>) {}
  async update(userId: Condition<ObjectId> | undefined, accessToken: string) {
    await this.userModel!.updateOne(
      { _id: userId },
      {
        $set: {
          accessToken,
        },
      },
    )
  }
}

const makeSut = () => {
  const userModel = db.collection("users")
  const sut = new UpdateAccessTokenRepository(userModel)
  return { sut, userModel }
}

describe("UpdateAccessToken Repository", () => {
  beforeAll(async () => {
    client = await MongoHelper.connect(process.env.MONGO_URL as string)
    db = client.db()
  })

  beforeEach(async () => {
    await db.collection("users").deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  it("Should update the user with the given accessToken ", async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: "valid_email@gmail.com",
      password: "hashed_password",
    })

    await sut.update(fakeUser.insertedId, "valid_token")
    const updatedFakeUser = await userModel.findOne({
      _id: fakeUser.insertedId,
    })
    expect(updatedFakeUser!.accessToken).toBe("valid_token")
  })
})
