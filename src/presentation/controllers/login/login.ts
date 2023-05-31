import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, serverError } from '../../helpers/http-helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
