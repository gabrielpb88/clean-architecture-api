import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { ok, serverError, unauthorized } from '../../helpers/http/http-helpers'
import { Authenticator } from '../../../domain/usecases/authenticator'
import { Validation } from '../../protocols/validation'

export class LoginController implements Controller {
  constructor (
    private readonly authenticator: Authenticator,
    private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest)
      const { email, password } = httpRequest.body
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
