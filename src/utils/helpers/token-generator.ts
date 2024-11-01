import { jwt } from "@/__mocks__/mock-jsonwebtoken"
import { ITokenGenerator } from "@/domain/protocols"
import { MissingParamError } from "../errors"

export class TokenGenerator implements ITokenGenerator {
  async generate(id?: string) {
    if (!id) {
      throw new MissingParamError("id")
    }
    const token = await jwt.sign(id, "secret")
    return token
  }
}
