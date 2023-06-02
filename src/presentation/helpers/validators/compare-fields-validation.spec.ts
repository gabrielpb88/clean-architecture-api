import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'secondField')
}
describe('CompareFields Validation', () => {
  test('Should return an error when fields are different', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', secondField: 'different_value' })
    expect(error).toEqual(new InvalidParamError('secondField'))
  })

  test('Should not return when validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', secondField: 'any_value' })
    expect(error).toBeFalsy()
  })
})
