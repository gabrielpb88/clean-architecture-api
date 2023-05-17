import { Collection, MongoClient } from 'mongodb'

export abstract class MongoHelper {
  private static client: MongoClient

  private constructor () {}

  static async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  }

  static async disconnect (): Promise<void> {
    await this.client.close()
  }

  static getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
}
