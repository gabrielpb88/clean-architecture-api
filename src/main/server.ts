import { MongoHelper } from '../infra/db/mongodb/helper/mongo-helper'
import env from '../main/config/env'

const port = env.port
MongoHelper.connect(env.mongoUrl).then(async () => {
  const app = (await import ('./config/app')).default
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}).catch(console.error)
