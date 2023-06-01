import { Validation } from './validation'
import { InvalidParamError } from '../../errors'

export class CompareFieldsValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly fieldToCompare: string) {}

  validate (input: any): Error {
    if (this.fieldName !== this.fieldToCompare) {
      return new InvalidParamError(this.fieldToCompare)
    }
  }
}
