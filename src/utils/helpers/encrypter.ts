import { bcrypt } from "@/__mocks__/mock-bcrypt"
import { MissingParamError } from "../errors"
import { IEncrypt } from "../protocols"

export class Encrypter implements IEncrypt {
  async compare(value?: string, hash?: string) {
    if (!value) {
      throw new MissingParamError("value")
    }
    if (!hash) {
      throw new MissingParamError("hash")
    }
    const isValid = await bcrypt.compare(value, hash)

    return isValid
  }
}
