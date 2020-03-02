
import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

// import { spawn } from 'child_process'

const PORT = 8080
const app = express()

app.use(bodyParser.json())

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.use((req, res, next) => {
  console.log('Request:')
  console.log(req)
  console.log('Response:')
  console.log(res)
  // res.status(200).send({ name: 'Well, Hard to tell...' });
  next()
})

app.get(['/hello', '/hey'], (req, res) => {
  res.json({ result: 'Hi there...' })
})

app.get('/error', (request, response, next) => {
  // console.log('pre simulationg Error')
  // console.log('Request:')
  // console.log(request)
  // console.log('Response:')
  // console.log(response)
  next()
}, () => {
  setImmediate(() => {
    throw new Error('Simulating Error')
  })
})

app.get('/module', (req, res) => {
  // res.send(`

  //   "use strict";
  //   Object.defineProperty(exports, "__esModule", { value: true });
  //   var Suppliers;
  //   (function (Suppliers) {
  //       Suppliers["TPM"] = "tpm";
  //       Suppliers["GDS"] = "gds";
  //       Suppliers["MCH"] = "mch";
  //       Suppliers["CMS"] = "cms";
  //   })(Suppliers = exports.Suppliers || (exports.Suppliers = {}));
  //   alert('Hello External Module')

  // `)

  res.status(200)
  res.setHeader('Content-Type', 'application/javascript')
  res.setHeader('Cache-Control', 'no-cache')
  res.sendFile(path.resolve(__dirname, './configModule.js'))
})

app.get('/*', (req, res) => {
  res.json({ result: 'ok' })
})

app.listen(PORT, () => {
  console.log('app running at 8080')
})

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception')
  console.error(err)
})

process.on('unhandledRejection', (reason) => {
  console.log('unhandledRejection')
  throw reason // you should handle all exceptions in tests explixitly
})

// process
//   .on('unhandledRejection', (reason, promise) => {
//     console.log('unhandledRejection')
//     console.error(reason, 'Unhandled Rejection at Promise', promise)
//   })
//   .on('uncaughtException', err => {
//     console.log('uncaughtException')
//     console.error(err, 'Uncaught Exception thrown')
//     process.exit(1)
//   })

// (function main() {
//   if (process.env.process_restarting) {
//     delete process.env.process_restarting
//     // Give old process one second to shut down before continuing ...
//     setTimeout(main, 1000)
//     return
//   }

//   // ...

//   // Restart process ...
//   spawn(process.argv[0], process.argv.slice(1), {
//     // eslint-disable-next-line @typescript-eslint/camelcase
//     env: { process_restarting: 1 },
//     stdio: 'ignore',
//   }).unref()
// })()
