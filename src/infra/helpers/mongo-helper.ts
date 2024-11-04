import { MongoClient, Db } from "mongodb"

export interface MongoHelperType {
  client: MongoClient | null
  db: Db | null
  uri: string | null
  connect(uri: string, dbName?: string): Promise<MongoClient>
  disconnect(): Promise<void>
}

export const MongoHelper: MongoHelperType = {
  client: null,
  db: null,
  uri: null,

  async connect(uri: string, dbName: string) {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
    this.db = this.client.db(dbName)
    return this.client
  },

  async disconnect() {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
      this.uri = null
    }
  },
}
