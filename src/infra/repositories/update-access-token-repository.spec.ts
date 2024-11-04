import { MongoClient, Db } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { MissingParamError } from "@/utils/errors"
import { UpdateAccessTokenRepository } from "./update-access-token-repository"
import { createFakeUser } from "@/utils/helpers/create-faker-user"

let client: MongoClient
let db: Db

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
    await db.collection("users").deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it("Should update the user with the given accessToken ", async () => {
    const { sut, userModel } = makeSut()
    const fakeUserId = await createFakeUser(userModel)

    await sut.update(fakeUserId, "valid_token")
    const updatedFakeUser = await userModel.findOne({
      _id: fakeUserId,
    })
    expect(updatedFakeUser!.accessToken).toBe("valid_token")
  })
  it("Should throw if no userModel is provided", async () => {
    const { userModel } = makeSut()
    const sut = new UpdateAccessTokenRepository()
    const fakeUserId = await createFakeUser(userModel)

    const promise = sut.update(fakeUserId, "valid_token")

    expect(promise).rejects.toThrow()
  })

  it("Should throw if no params is provided", async () => {
    const { sut, userModel } = makeSut()
    const fakeUserId = await createFakeUser(userModel)

    expect(sut.update()).rejects.toThrow(new MissingParamError("userId"))
    expect(sut.update(fakeUserId)).rejects.toThrow(
      new MissingParamError("accessToken"),
    )
  })
})
