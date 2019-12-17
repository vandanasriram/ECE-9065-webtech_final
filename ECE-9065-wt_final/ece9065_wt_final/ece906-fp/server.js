var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
const dbConfig = require('./config/database.config.js');
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("."));
const dotenv = require('dotenv');
dotenv.config();

console.log("url-> " + dbConfig.url);
mongoose.connect(dbConfig.url, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get("/ping", (req, res) => {
    res.status(200).send({});
});

require('./routes/main.routes.js')(app);
require('./routes/user.routes.js')(app);
require('./routes/song.routes.js')(app);
require('./routes/review.routes.js')(app);
require('./routes/playlist.routes.js')(app);

app.listen(8080, () => {
 console.log("Server running on port 8080");
});