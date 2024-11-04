import { Collection, Document } from "mongodb"

export class LoadUserByEmailRepository {
  constructor(private readonly userModel?: Collection<Document>) {}

  async load(email: string) {
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
