/* eslint-disable no-console,no-unused-vars,no-unreachable */
import path from 'path'
import fs from 'fs'

import { trim } from 'ramda'

const dataFile = 'instructionStatusCatalog.csv'

const SAVE_DATA = true

const dataSchema = {
  id: '',
  usedForInstruction: '',
  usedForItem: '',
  status: '',
  GroupId: '',
  TextCS: '',
  TextEN: '',
  TextSK: '',
}

const indexMapperFactory = ({ schema, firstLine }) => Object.keys(schema).map((key) => {
  return [key, firstLine.indexOf(key)]
})

const mapLineFactory = (indexMapper) => (line) => indexMapper.reduce((agr, nameValueIndex) => {
  if (nameValueIndex[1] > -1) {
    agr[nameValueIndex[0]] = line[nameValueIndex[1]]
  }
  return agr
}, {})

fs.readFile(path.resolve(__dirname, dataFile), 'utf8', (err, data) => {
  const lines = data.split('\r\n')
  // console.log(lines)

  const firstLine = lines.shift().split(';').map(trim)
  // console.log('firstLine', firstLine)
  // console.log('lines.length')
  // console.log(lines.length)

  const indexMapper = indexMapperFactory({ schema: dataSchema, firstLine })

  const mapLine = mapLineFactory(indexMapper)

  const obj = []

  lines.forEach((line) => {
    const columns = line.split(';')
    const cmp = mapLine(columns)
    // console.log(cmp)
    obj.push(cmp)
  })

  const jsonString = JSON.stringify(obj, null, 2)
  if (SAVE_DATA) {
    fs.writeFileSync(path.resolve(__dirname, 'data.json'), jsonString, 'UTF-8')
  } else {
    console.log(jsonString)
  }

  if (err) {
    throw err
  }
})
