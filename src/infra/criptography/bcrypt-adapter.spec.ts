import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcrypt Adapter', function () {
  test('Should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const spyHash = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(spyHash).toHaveBeenCalledWith('any_value', salt)
  })
})
