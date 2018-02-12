const express = require('express');
const bodyParser = require('body-parser');

// using Express's server
const app = express();
// set up the server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => console.log("Server listening on port 3000"));

app.get('/', function(req, res) {
	res.send("New bot. who dis?");
});