import { AddAccountRepository } from 'data/usecases/protocols/add-account-repository'
import { AddAccountModel } from 'domain/usecases/add-account'
import { AccountModel } from 'domain/models/account'
import { MongoHelper } from '../helper/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const { _id, ...accountWithoutId } = await accountCollection.findOne(result.insertedId)
    return Object.assign({} as unknown as AccountModel, accountWithoutId, { id: _id })
  }
}
