const puppeteer = require('puppeteer');
const path =  require('path');
const express = require('express');
const app = express();
const PORT = 8888;

// setup server for test pages.
app.use('/', express.static(path.join(__dirname, `environment`)));
app.use('/dist',express.static(path.join(__dirname, `../dist`)));
app.get('/idbify.js', (req, res) => res.sendFile(path.join(__dirname, `../idbify.js`)));

const server = app.listen(PORT)


// setup and run tests
let browser, page;

beforeAll( async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}/index.html`);
})

afterAll( async () => {
  browser.close();
  server.close();
})

test('Write to IDB and get a value back.', async () => {
  const val = await page.evaluate( async () => await document.idb.get(0) );
  expect(val).toEqual({the_key: 0, the_index: `group 0`, the_value: `value 0`});
})

test('Find all items in an index', async () => {
  const val = await page.evaluate( async () => await document.idb.find({index: `the_index`, term: `group 0`}) );
  expect(val.length).toEqual(5)
})

test('Delete an item', async () => {
  const val = await page.evaluate( async () => {
    document.idb.delete(0)
    return await document.idb.find({index: `the_index`, term: `group 0`});
  });
  expect(val.length).toEqual(4)
})

test('Cleares all items in the idb', async () => {
  const item = await page.evaluate( async () => {
    await document.idb.clear();
    return await document.idb.get(0)
  })
  expect(item).toEqual(undefined)
})
