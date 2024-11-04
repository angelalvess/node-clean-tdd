import { Collection } from "mongodb"

export const createFakeUser = async (
  userModel: Collection,
  email = "valid_email@gmail.com",
  password = "hashed_password",
) => {
  const result = await userModel.insertOne({
    email,
    password,
  })
  return result.insertedId
}
