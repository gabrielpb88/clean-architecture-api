import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Authenticator } from '../../../domain/usecases/authenticator'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator,
    private readonly authenticator: Authenticator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const accessToken = await this.authenticator.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
