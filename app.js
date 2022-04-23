const express = require('express')

const app = express()
const port = 8180
const hostname = '127.0.0.1'

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/foo/bar', (request, response) => {
  response.send("foo")
})

app.get('/', (request, response) => {
  response.send("Home")
})
