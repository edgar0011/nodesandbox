
import express from 'express'
import bodyParser from 'body-parser'

const PORT = 8080
const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log('Request:')
  console.log(req)
  console.log('Response:')
  console.log(res)
  // res.status(200).send({ name: 'Well, Hard to tell...' });
  next()
})

app.get('/', (req, res) => {
  res.json({ result: 'ok' })
})

app.get(['/hello', '/hey'], (req, res) => {
  res.json({ result: 'Hi there...' })
})

app.listen(PORT, () => {
  console.log('app running at 8080')
})
