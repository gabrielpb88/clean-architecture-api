import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { LoginController } from './login'
import { HttpRequest } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'
import { Authenticator } from '../../../domain/usecases/authenticator'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticatorStub: Authenticator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const authenticatorStub = makeAuthenticatorStub()
  const sut = new LoginController(emailValidatorStub, authenticatorStub)
  return {
    sut,
    emailValidatorStub,
    authenticatorStub
  }
}

const makeAuthenticatorStub = (): Authenticator => {
  class AuthenticatorStub implements Authenticator {
    async auth (email: string, password: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticatorStub()
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

describe('Login UseCase', () => {
  test('Should return 400 when email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 when password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeHttpRequest())
    expect(emailValidatorSpy).toHaveBeenCalledWith(makeHttpRequest().body.email)
  })

  test('Should return 400 when email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 when EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSut()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
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
