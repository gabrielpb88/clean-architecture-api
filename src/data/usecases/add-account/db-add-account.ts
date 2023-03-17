import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './db-add-account.protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { name, email, password } = account
    const hashedPassword = await this.encrypter.encrypt(password)
    const accountModel = {
      id: '', name, email, password: hashedPassword
    }
    return new Promise(resolve => { resolve(accountModel) })
  }
}
