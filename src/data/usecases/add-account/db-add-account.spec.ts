import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../protocols/encrypter'

describe('DbAddAccount UseCase', function () {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterSub implements Encrypter {
      async encrypt (password: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_password') })
      }
    }
    const encrypterSub = new EncrypterSub()
    const sut = new DbAddAccount(encrypterSub)
    const encryptSpy = jest.spyOn(encrypterSub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
