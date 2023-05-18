import app from '../app'
import request from 'supertest'

describe('Content Type Middleware', () => {
  test('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app).get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return content type xml when forced', async () => {
    app.get('/test_content_type_other', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app).get('/test_content_type_other')
      .expect('content-type', /xml/)
  })
})
