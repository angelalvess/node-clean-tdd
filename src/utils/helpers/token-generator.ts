import { jwt } from "@/__mocks__/mock-jsonwebtoken"
import { ITokenGenerator } from "@/domain/protocols"
import { MissingParamError } from "../errors"

export class TokenGenerator implements ITokenGenerator {
  constructor(public readonly secret?: string) {}
  async generate(id?: string) {
    if (!id) {
      throw new MissingParamError("id")
    }
    if (!this.secret) {
      throw new MissingParamError("secret")
    }

    const token = await jwt.sign(id, this.secret!)
    return token
  }
}
