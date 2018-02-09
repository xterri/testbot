'user strict'

const express		= require('express')
const bodyParser	= require('body-parser')
const request		= require('request')

const app			= express()

// set port
app.set('port', (process.env.PORT || 5000))

// process data 
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// set routes >> tells us what each part of the code does
app.get('/', function(req, res) {
	res.send('Chatbot set')
})

// page access token
let token = "" 

// set route to facebook? 
app.get('/webhook/', function(req, res) {
	// verifies token >> server sends req & checks if it matches with verify_token
	if (req.query['hub.verify_token'] == "xterri") {
		res.send(req.query['hub.challenge'])
	}
	else
		res.send("wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i = messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id

		if (event.message && event.message.text) {
			let text = event.message.text
			sendText(sender, "Text Echo: " + text.substring(0, 100))
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs: {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message: messageData
		}
	}, function(error, response, body) {
		if (error) 
			console.log("Sending error")
		else if (response.body.error) 
			console.log("response body error")
	})
}

app.listen(app.get('port'), function () {
	console.log("running port")
})
