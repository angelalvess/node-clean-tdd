import { MissingParamError } from "@/utils/errors"
import { ILoadUserByEmailRepository } from "@/utils/protocols"
import { Collection, Document } from "mongodb"

export class LoadUserByEmailRepository implements ILoadUserByEmailRepository {
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
    return user
  }
}
