export const jwt = {
  token: "some_token" as string | null,
  id: "",
  secret: "",

  async sign(id: string, secret: string) {
    this.id = id
    this.secret = secret
    return this.token
  },
}
