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
import { MissingParamError } from "@/utils/errors"

let client: MongoClient
let db: Db

class UpdateAccessTokenRepository {
  constructor(private readonly userModel?: Collection<Document>) {}
  async update(userId?: Condition<ObjectId> | undefined, accessToken?: string) {
    if (!userId) {
      throw new MissingParamError("userId")
    }

    if (!accessToken) {
      throw new MissingParamError("accessToken")
    }
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
  it("Should throw if no userModel is provided", async () => {
    const { userModel } = makeSut()
    const sut = new UpdateAccessTokenRepository()
    const fakeUser = await userModel.insertOne({
      email: "valid_email@gmail.com",
      password: "hashed_password",
    })
    const promise = sut.update(fakeUser.insertedId, "valid_token")

    expect(promise).rejects.toThrow()
  })

  it("Should throw if no params is provided", async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: "valid_email@gmail.com",
      password: "hashed_password",
    })

    expect(sut.update()).rejects.toThrow(new MissingParamError("userId"))
    expect(sut.update(fakeUser.insertedId)).rejects.toThrow(
      new MissingParamError("accessToken"),
    )
  })
})
