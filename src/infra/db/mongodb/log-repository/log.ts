import { LogErrorRepository } from 'data/usecases/protocols/log-error-repository'
import { MongoHelper } from '../helper/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (errorStack: string): Promise<void> {
    const collection = await MongoHelper.getCollection('errors')
    await collection.insertOne({
      stack: errorStack,
      date: new Date()
    })
  }
}
