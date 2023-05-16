import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from '.'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    return this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
  }
}
