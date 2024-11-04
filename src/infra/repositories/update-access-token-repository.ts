import { MissingParamError } from "@/utils/errors"
import { Collection, Condition, ObjectId, Document } from "mongodb"

export class UpdateAccessTokenRepository {
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
