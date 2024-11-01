import { bcrypt } from "@/__mocks__/mock-bcrypt"

export class Encrypter {
  async compare(value: string, hash: string) {
    const isValid = await bcrypt.compare(value, hash)

    return isValid
  }
}
