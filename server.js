const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
var dbActions = require('./database.js');
 
const app = express();
const port = 3030;
 
app.use(cors());
 
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
app.post('/save', (req, res) => {
  res.send(dbActions.data(req.body));

});
 
app.listen(port, () => console.log(`app listening on port ${port}!`));