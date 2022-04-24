import express, {Request,Response,Application} from 'express';
import path from 'path';
import Parser from 'rss-parser';
import rp from 'request-promise';
import $ from 'cheerio';
import download from 'image-downloader'
import db from "./db/database";
import fs from 'fs'

const app:Application = express();
const port = 8180;
const hostname = '0.0.0.0';

const parser  = new Parser();

db.sequelizeInstance.sync();

console.log(process.cwd());
if(! fs.existsSync("img")){
  console.log("no folder ");
  fs.mkdirSync("img")
}

function downloadImage(url: string, filepath: string ='../../img/') {
  return download.image({
     url,
     dest: filepath ,
     extractFilename: true
  })
}

var now = new Date();
var min = now.getMinutes();
var startIn = 10 - (min % 10);
setTimeout(runInterval, startIn * 60 * 1000);
// Run every 10 minutes, on the 10 minutes mark
function runInterval() {
    setInterval(function() {
        fetching();
    }, 10 * 60 * 1000);
}

async function fetching(){
  console.log(new Date());
  console.log("FETCHING");
  fetchFeed()
}

class Release {
  id: Number | undefined;
  title: string;
  link: string;
  categories: String[];
  nfo: string;
  content: string;
  download_link: string;
  image: string;

  constructor(
    id: Number , 
    title: string, 
    link: string, 
    categories: String[], 
    nfo: string, 
    content: string, 
    download_link: string, 
    image: string
) {
    this.id = id
    this.title = title
    this.link = link
    this.categories = categories
    this.nfo = nfo
    this.content = content
    this.download_link = download_link
    this.image = image
  }

}

async function fetchFeed(url: string = "https://hd-source.to/feed/") {
  let feed = await parser.parseURL(url);

  feed.items.forEach((item) => {
    db.Release.findAll({
      where: {
        title: item.title
      }
    }).then((releases: Array<Release>) => {
      if(releases.length == 0) {
        rp(String(item.link))
          .then(function(html){
            //success!
            console.log(item);
            const img = $('.entry-content', html).find("img").attr("data-src") ?? "";
            const img_link = 
              downloadImage(img)
                  .then(({ filename }) => {
                    db.Release.create({
                      title: item.title,
                      pubDate: item.pubDate,
                      nfo: "nfo",
                      content: item.content,
                      link: item.link,
                      download_link: item.link,
                      image: filename.split('\\').pop()
                    }) 
                    // return filename // saved to /path/to/dest/image.jpg
                  });              
                    
          })
          .catch(function(err){
            //handle error
          });
      } else {
        //console.log(item.title);
        //console.log("Eintrag bereits enthalten");
      }
    });
    
  });
}

// const client = new Client(
//   {
//     user: process.env.PGUSER || "postgres",
//     host: process.env.PGHOST || "localhost",
//     database: process.env.PGDATABASE || "postgres",
//     password: process.env.PGPASSWORD || "admin",
//     port: Number(process.env.PGPORT) || 5432,
//   }
// );

// client.connect().then(() => {
//   client.query('SELECT NOW()', (err, res) => {
//     console.log(res.rows)
//   });
// });

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', (request, response) => {
    response.send("Fuck Yeah")
  })

app.get('/image/:filename', (request, response) => {
  response.sendFile(path.join(__dirname, '/img/' + request.params.filename));
})

app.get('/html', (request, response) => {
  response.sendFile(path.join(__dirname, '/basic.html'));
})

app.get("/releases", async (req, res) => {
  db.Release.findAll()
  .then( (releases: any) => {
      res.status(200).send(JSON.stringify(releases));
  })
  .catch( (err: any) => {
      res.status(500).send(JSON.stringify(err));
  });
});
