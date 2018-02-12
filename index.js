const express = require('express');
const bodyParser = require('body-parser');

// set up the server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => console.log("Server listening on port " + app.get('port')));

const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');

app.get('/', function(req, res) {
	res.send("New bot. who dis?\n\n" + req.body);
});

app.get('/webhook', verificationController);
app.post('/webhook', messageWebhookController);


