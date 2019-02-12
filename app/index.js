import express from 'express'
import puppeteer from 'puppeteer'

/*(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  console.log(page)
  await page.goto('https://news.ycombinator.com', { waitUntil: 'networkidle2' })
  const pdf = await page.pdf({ path: 'hn.pdf', format: 'A4' })
  console.log(pdf)

  await browser.close()
})()*/

const obtainFavIcon = async (url) => {
  console.log(puppeteer)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // console.log(page)
  await page.goto(url || 'https://www.facebook.com');

  console.log('page')
  console.log(page)

  let favIcon = await page.evaluate(() => {
    // const iconNode = document.querySelector('link[rel="shortcut icon"]')
    const iconNode = document.querySelector('link[rel*="icon"]');
    let icon = iconNode ? iconNode.getAttribute('href') : null
    console.log('icon')
    console.log(icon)
    return icon
  });

  if (favIcon && favIcon.indexOf('http') === -1) {
    if (favIcon.indexOf('//') === 0) {
      favIcon = `http:${favIcon}`
    } else {
      favIcon = `${url}${favIcon}`
    }
  }

  console.log('favIcon:', favIcon)
  // const image = await page.screenshot({ path: 'example.png' });
  // console.log(image)

  await browser.close();
  return favIcon
}


const PORT = 8080;
const app = express();


app.get('/api/favIcon', async (req, res) => {
  console.log(req.query)
  if (req.query.url) {
    const icon = await obtainFavIcon(req.query.url)
    res.json({ result: icon });
  }
  if (req.query.urls) {
    const icons = req.query.urls.split(',').map(url => obtainFavIcon(url))
    res.json({ result: await Promise.all(icons) });
  }
});

app.get(['/hello', '*'], (req, res) => {
  res.json({ result: 'Hi there...' });
});



app.listen(PORT, () => {
  console.log('app running at 8080');
});
