import express from 'express'
import puppeteer from 'puppeteer'
import path from 'path'
import bodyParser from 'body-parser'
import user from './api/routes/user'
import fs from 'fs'

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const obtainFavIcon = async (url) => {
  console.log('obtainFavIcon started', Date.now(), url)
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'load', timeout: 0});

  let favIcon = await page.evaluate(() => {
    const iconNode = document.querySelector('link[rel*="icon"]');
    let icon = iconNode ? iconNode.getAttribute('href') : null
    return icon
  });

  if (favIcon && favIcon.indexOf('http') === -1) {
    if (favIcon.indexOf('//') === 0) {
      favIcon = `http:${favIcon}`
    } else {
      favIcon = `${url}${favIcon}`
    }
  } else {
    // last resort, no head tag but just .../favicon.ico
    favIcon = `${url}/favicon.ico`
  }

  await browser.close();
  console.log('obtainFavIcon ended', Date.now())
  return favIcon
}

const parseIconsResults = async (urls) => {
  // const icons = urls.map(url => obtainFavIcon(url))
  // const resolvedIcons = await Promise.all(icons)

  const resolvedIcons = await urls.reduce(async (promise, url) => {
    return promise.then(iconResults => {
      return obtainFavIcon(url).then(icon => [...iconResults, icon])
    })
  }, Promise.resolve([]))

  console.log('resolvedIcons')
  console.log(resolvedIcons)
  return {
    urls,
    icons: resolvedIcons
  }
}

parseIconsResults.DEFAULT_URL = 'https://www.facebook.com'

const readUrlsFromFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, './data/urls2') , 'utf8', (error, data) => {
      if (error) {
        return reject(error);
      }
      const fileContent = data.split('\n')
      return resolve(fileContent )
    })
  })
}

const PORT = 8080;
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json())
app.get('/urls', async (req, res) => {

  let urls
  if (!req.query.url && !req.query.urls) {
    urls = await readUrlsFromFile()
    console.log(urls)
  } else {
    urls = !req.query.urls ? [req.query.url || parseIconsResults.DEFAULT_URL] : req.query.urls.split(',')
  }
  res.render('urls', await parseIconsResults(urls))
});

app.get('/api/favIcon', async (req, res) => {

  let urls
  if (!req.query.url && !req.query.urls) {
    urls = await readUrlsFromFile()
    console.log(urls)
  } else {
    urls = !req.query.urls ? [req.query.url || parseIconsResults.DEFAULT_URL] : req.query.urls.split(',')
  }

  res.status(202).send(await parseIconsResults(urls))
});

app.use('/user', user)


app.get(['/hello', '*'], (req, res) => {
  res.json({ result: 'Hi there...' });
});

app.listen(PORT, () => {
  console.log('app running at 8080');
});
