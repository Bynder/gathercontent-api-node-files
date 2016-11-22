var fetch = require('node-fetch');
var base64 = require('base-64');
var fs = require('fs'),
  auth = JSON.parse(fs.readFileSync('auth.json', { 'encoding': 'utf8' }));

const PROJECT_ID = '55217';
const ITEM_ID = '1907001';

const options = {
  method: 'GET',
  headers: {
    'Authorization': 'Basic ' + base64.encode(auth.user + ':' + auth.key),
    'Accept': 'application/vnd.gathercontent.v0.5+json'
  }
};

function downloadFiles(files) {
  files.map(file => {
    fetch(file.url)
      .then(res => {
        console.log(`Downloading ${file.filename}...`);
        const writeStream = fs.createWriteStream(file.filename);
        res.body.pipe(writeStream);
      });
  });
}

fetch(`https://api.gathercontent.com/items/${ITEM_ID}/files`, options)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        downloadFiles(json.data);
    }).catch(err => console.log)
