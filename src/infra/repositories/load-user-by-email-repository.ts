import { MissingParamError } from "@/utils/errors"
import { Collection, Document } from "mongodb"

export class LoadUserByEmailRepository {
  constructor(private readonly userModel?: Collection<Document>) {}

  async load(email?: string) {
    if (!email) {
      throw new MissingParamError("email")
    }

    const user = await this.userModel!.findOne(
      { email },
      {
        projection: {
          password: 1,
        },
      },
    )
    return user ? user : null
  }
}
