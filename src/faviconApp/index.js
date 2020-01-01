import express from 'express'
import puppeteer from 'puppeteer'
import path from 'path'
import bodyParser from 'body-parser'
import fs from 'fs'
import { URL } from 'url'

import user from './api/routes/user'

const obtainFavIcon = async(url) => {
  console.log('obtainFavIcon started', Date.now(), url)
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  const redirected = await page.goto(url, { waitUntil: 'load', timeout: 0 })

  if (redirected.headers().status !== '200') {
    return null
  }

  let favIcon = await page.evaluate(() => {
    const iconNode = document.querySelector('link[rel*="icon"]')
    const icon = iconNode ? iconNode.getAttribute('href') : null
    return icon
  })

  const myURL = new URL(url)

  if (favIcon) {
    if (favIcon.indexOf('http') === -1) {
      if (favIcon.indexOf('//') === 0) {
        favIcon = `http:${favIcon}`
      } else {
        favIcon = `${myURL.protocol}//${myURL.host}${favIcon}`
      }
    }
  } else {
    // last resort, no head tag but just .../favicon.ico
    favIcon = `${myURL.protocol}//${myURL.host}/favicon.ico`
  }

  await browser.close()
  console.log('obtainFavIcon ended', Date.now())
  console.log('obtainFavIcon favIcon', favIcon)
  return favIcon
}

const parseIconsResults = async(urls) => {
  // const icons = urls.map(url => obtainFavIcon(url))
  // const resolvedIcons = await Promise.all(icons)

  let resolvedIcons = await urls.reduce(async(promise, url) => {
    return promise.then(iconResults => {
      return obtainFavIcon(url).then(icon => [...iconResults, icon ? { url, icon } : null])
    })
  }, Promise.resolve([]))

  resolvedIcons = resolvedIcons.filter(icon => !!icon)

  console.log('resolvedIcons')
  console.log(resolvedIcons)
  return {
    urls: resolvedIcons.map(({ url }) => url),
    icons: resolvedIcons.map(({ icon }) => icon),
  }
}

parseIconsResults.DEFAULT_URL = 'https://www.facebook.com'

const readUrlsFromFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, './data/urls3'), 'utf8', (error, data) => {
      if (error) {
        return reject(error)
      }
      const fileContent = data.split('\n').filter(url => !!url)
      return resolve(fileContent)
    })
  })
}

const PORT = 8080
const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json())
app.get('/urls', async(req, res) => {
  let urls
  if (!req.query.url && !req.query.urls) {
    urls = await readUrlsFromFile()
  } else {
    urls = !req.query.urls ? [req.query.url || parseIconsResults.DEFAULT_URL] : req.query.urls.split(',')
  }
  res.render('urls', await parseIconsResults(urls))
})

app.get('/api/favIcon', async(req, res) => {
  let urls
  if (!req.query.url && !req.query.urls) {
    urls = await readUrlsFromFile()
  } else {
    urls = !req.query.urls ? [req.query.url || parseIconsResults.DEFAULT_URL] : req.query.urls.split(',')
  }

  res.status(202).send(await parseIconsResults(urls))
})

app.use('/user', user)

app.use('/cms', (req, res, next) => {
  console.log(req)
  console.log(res)
  // next("hello")
  next()
}, (req, res) => {
  console.log(req)
  console.log(res)
  // next()
  res.json({ result: 'CMS not here...' })
  // res.redirect('http://www.google.com')
})

app.get(['/hello', '*'], (req, res) => {
  res.json({ result: 'Hi there...' })
})

app.listen(PORT, () => {
  console.log('app running at 8080')
})
