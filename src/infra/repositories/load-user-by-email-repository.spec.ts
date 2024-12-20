import { MongoClient, Db } from "mongodb"
import { beforeEach } from "node:test"
import { LoadUserByEmailRepository } from "./load-user-by-email-repository"
import { MongoHelper } from "../helpers/mongo-helper"
import { MissingParamError } from "@/utils/errors"

let client: MongoClient
let db: Db

const makeSut = () => {
  const userModel = db.collection("users")
  const sut = new LoadUserByEmailRepository(userModel)
  return { sut, userModel }
}

describe("LoadUserByEmail Repository", () => {
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

  it("Should return null if no user is found ", async () => {
    const { sut } = makeSut()
    const user = await sut.load("invalid_email@gmail.com")
    expect(user).toBeNull()
  })

  it("Should return an user if user is found ", async () => {
    const { userModel, sut } = makeSut()
    await userModel.insertOne({
      email: "valid_email@gmail.com",
      password: "hashed_password",
    })
    const user = await sut.load("valid_email@gmail.com")

    expect(user).toEqual({
      _id: user!._id,
      password: "hashed_password",
    })
  })

  it("Should throw if no userModel is provided", async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load("any_email@gmail.com")
    expect(promise).rejects.toThrow()
  })

  it("Should throw if no email is provided", async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError("email"))
  })
})
