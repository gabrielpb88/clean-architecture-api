import { ok, serverError, unauthorized } from '../../helpers/http/http-helpers'
import { LoginController } from './login'
import { HttpRequest } from '../../protocols'
import { AuthenticationModel, Authenticator } from '../../../domain/usecases/authenticator'
import { ValidationComposite } from '../../helpers/validators'

interface SutTypes {
  sut: LoginController
  authenticatorStub: Authenticator
}

const makeSut = (): SutTypes => {
  const authenticatorStub = makeAuthenticatorStub()
  const validationComposite = new ValidationComposite([])
  const sut = new LoginController(authenticatorStub, validationComposite)
  return {
    sut,
    authenticatorStub
  }
}

const makeAuthenticatorStub = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async auth (authModel: AuthenticationModel): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticatorStub()
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

describe('Login UseCase', () => {
  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    const authModel: AuthenticationModel = {
      email: httpRequest.body.email,
      password: httpRequest.body.password
    }
    expect(authSpy).toHaveBeenCalledWith(authModel)
  })

  test('Should return 500 when EmailValidator throws', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 401 when Authentication fails', async () => {
    const { sut, authenticatorStub } = makeSut()
    jest.spyOn(authenticatorStub, 'auth').mockReturnValue(null)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 when valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
