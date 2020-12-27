const express = require('express');
let request = require('request');
let querystring = require('querystring');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
const port = 3000
const client_id = '';
const client_secret = '';
const redirect_uri = 'http://localhost:4200/callback';
const scope = "user-read-private user-follow-read,user-follow-modify user-library-modify user-read-playback-state user-library-read playlist-modify user-read-email user-top-read playlist-read-private user-modify-playback-state streaming playlist-modify-private user-read-recently-played";
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/auth', cors(), (req, res) => {
    console.log("called");
    res.status(200);
    res.send(JSON.stringify('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + client_id +
    '&scope=' + encodeURIComponent(scope) +
    '&redirect_uri=' + encodeURIComponent(redirect_uri)));
})
app.use('/', express.static(path.join(__dirname, 'public/thmye')));
app.get('/logdata',(req,res)=>{
    var base=new Buffer(client_id+':'+client_secret).toString('base64');
    res.send({code:base});
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))