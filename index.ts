import express, {Request,Response,Application} from 'express';

const app:Application = express()
const port = 8180
const hostname = '127.0.0.1'

require('dotenv').config();

//import { Client } from 'pg';
//const client = new Client()
//client.connect()

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/foo/bar', (request, response) => {
  response.send("foo")
})

app.get('/', (request, response) => {
    response.send("Fuck Yeah")
  })

app.get('/api/times', (request:Request, response:Response) => {
    //client.query('SELECT * FROM public."time"', [], (err, res) => {
        //console.log(res.rows.at(0))        
        //console.log(res.rows.at(0).startTime)

      //  client.end()
      //  response.send(res.rows)

   // })
})
