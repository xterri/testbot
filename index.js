'use strict'

const express		= require('express');
const bodyParser	= require('body-parser');
const request		= require('request');

const app			= express();

// set port
app.set('port', (process.env.PORT || 5000));

// process data 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// set routes >> tells us what each part of the code does
app.get('/', function(req, res) {
	res.send("Hello, I am a bot");
});

// page access token >> can be save in an env variable on Heroku
	// let token = "EAAEvvO6eygoBAEy5hCbIsAaeZCj1HNf3gaC4yEeieHBhjbL9GgOvjrLgBHThCFg6kZCOw4bl2g7scr0W6tk7fdX05DjZB8jZA0lbdHfUi6rA5j7wveauqMUPv30pSWjtUAWZBuOc0roL9uZCZCTgoF3UlYs0mmZBsnu5uIFvPqBBQgZDZD"; 

// set route to facebook / facebook webhook >> endpoint FB uses to verify the app
app.get('/webhook/', function(req, res) {
	// verifies token >> server sends req & checks if it matches with verify_token
	if (req.query['hub.verify_token'] === process.env.VERIFICATION_TOKEN) {
		res.send(req.query["hub.challenge"]);
	} else {
		res.send("wrong token");
	}
});

// All callbacks for messenger will be POST-ed here (what our bot sends back to user)
	// when bot interaction occurs, update sent to Webhook
	// receive messages by listening for POST calls at webhook
	// all callbacks made to this webhook
app.post("/webhook", function(req, res) {
	// ensure this is a page subscription
	if (req.body.object == "page") {
		// iterate over each entry; may have multiple entries if batched
		req.body.entry.forEach(function(entry) {
			// iterate over each messaging event
			entry.messaging.forEach(function(event) {
				if (event.postback) {
					processPostback(event); // need to create this function
				}
			});
		});
		// indicates that everything is okay to send; if error send 403
		res.sendStatus(200);
	}
});

/*
** postback = user has clicked a button or something configured to send a postback to bot
*/
function processPostback(event) {
	var senderID = event.sender.id;
	var payload = event.postback.payload;
	
	// payload = from 'call_to_actions' set in terminal after setting up "Get Started" button
	// check to see if event was sent b/c of clicking the "Get Started" button
	if (payload === "Greeting") {
		// get user's name from User Profile API and include into greeting
			// API has access to >> first name, last name, profile picture, locale, timezone, gender
	// send request to API to get data, then function in request processes the results returns whatever  
		request({
			url: "https://graph.facebook.com/v2.6/" + senderId,
			qs: {
				access_token: process.env.PAGE_ACCESS_TOKEN,
				fields: "first_name"
			},
			method: "GET"
		}, function(error, response, body) {
			var greeting = "";
			if (error) {
				console.log("Error getting user's name: " + error);
			} else {
				var bodyObj = JSON.parse(body);
				name = bodyObj.first_name;
				greeting = "Hilo " + name + ". "; // if all goes well create personalized greeting
			}
			// combine greeting with message and sent to sendMessage() function
			var message = greeting + "I am a Test Bot. I am in development / experimental mode. I will do my best to satisfy my purpose. I will not just be a \"Pass the Butter\" bot.";
			sendMessage(senderId, {text: message}); // need to create this function
		});
	}
}

/*
** POST's messages back to Messenger Platform
*/
function sendMessage(recipientId, message) {
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs: {
			access_token: process.env.PAGE_ACCESS_TOKEN
		},
		method: "POST",
		json: {
			recipient: {id: recipientId},
			message: message,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("Error sending message: " + response.error);
		}
	});
}

/*
// Code below returns a duplicate message up to 100 characters, from user to user
app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging;

	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i];
		let sender = event.sender.id;

		if (event.message && event.message.text) {
			let text = event.message.text;
			sendText(sender, "Text Echo: " + text.substring(0, 100));
		}
	}
	res.sendStatus(200);
});

function sendText(sender, text) {
	let messageData = {text: text};
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
			console.log("Sending error");
		else if (response.body.error) 
			console.log("response body error");
	});
}
*/

app.listen(app.get('port'), function () {
	console.log("running port");
});
