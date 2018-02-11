//'use strict'

var express			= require('express');
var bodyParser		= require('body-parser');
var request			= require('request');

// set up db connection 
var mongoose		= require("mongoose");
var db				= mongoose.connect(process.env.MONGODB_URI);
var Movie			= require("./models/movie");

//var admin			= require("firebase-admin");
//var serviceAccount	= require("./testbot-bcd78-firebase-adminsdk-14hk8-55d666ff0b.json");

var app				= express();

// set up firebase db
/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testbot-bcd78.firebaseio.com"
});
*/

// process data 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// set port
app.set('port', (process.env.PORT || 5000));
//app.listen((process.env.PORT || 5000));

// set routes >> tells us what each part of the code does
app.get('/', function(req, res) {
	res.send("Deplorable, I am a bot");
});

// page access token >> can be save in an env variable on Heroku
	// let token = "EAAEvvO6eygoBAEy5hCbIsAaeZCj1HNf3gaC4yEeieHBhjbL9GgOvjrLgBHThCFg6kZCOw4bl2g7scr0W6tk7fdX05DjZB8jZA0lbdHfUi6rA5j7wveauqMUPv30pSWjtUAWZBuOc0roL9uZCZCTgoF3UlYs0mmZBsnu5uIFvPqBBQgZDZD"; 

// set route to facebook / facebook webhook >> endpoint FB uses to verify the app
app.get("/webhook", function(req, res) {
	// verifies token >> server sends req & checks if it matches with verify_token
	if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
		console.log("verified webhook");
		res.status(200).send(req.query["hub.challenge"]);
		//res.send(req.query["hub.challenge"]);
	} else {
		console.log("verification failed. tokens do not match.");
		res.sendStatus(403);
		//res.send("wrong token");
	}
});

// All callbacks for messenger will be POST-ed here (what our bot sends back to user)
	// when bot interaction occurs, update sent to Webhook
	// receive messages by listening for POST calls at webhook
	// all callbacks made to this webhook
app.post("/webhook", function (req, res) {
	// ensure this is a page subscription
	if (req.body.object == "page") {
		// iterate over each entry; may have multiple entries if batched
		req.body.entry.forEach(function(entry) {
			// iterate over each messaging event
			entry.messaging.forEach(function(event) {
				if (event.postback) {
					processPostback(event); // need to create this function
				} else if(event.message) {
					processMessage(event);
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
	var senderId = event.sender.id;
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
				greeting = "Hi " + name + "! "; // if all goes well create personalized greeting
			}
			// combine greeting with message and sent to sendMessage() function
			var message = greeting + "I am a Test Bot. I am in development / experimental mode. I will do my best to satisfy my purpose. I will not just be another bot.";
			sendMessage(senderId, {text: message}); // need to create this function
		});
	// check the correct/incorrect payload messages; sees if bot found the correct movie
	} else if (payload === "Correct") {
		sendMessage(senderId, {text: "Great! What would you like to find out? Enter 'plot', 'date', 'runtime', 'director', 'cast', or 'rating' for the various details."});
	} else if (payload === "Incorrect") {
		sendMessage(senderId, {text: "Oops! Sorry! Try using the exact title of the movie"});
	}
}

/*
** message - handles messages from user and returns something
*/
function processMessage(event) {
	// check if msg sent via echo callback (from the page)
	// avoid processing / ignore your own messages 
	if (!event.message.is_echo) {
		var message = event.message;
		var senderId = event.sender.id;

		console.log("Message from senderId: " + senderId);
		console.log("Message is: " + JSON.stringify(message));

		//check if message is a text or an attachment (one or either cannot be both)
		if (message.text) {
			var formattedMsg = message.text.toLowerCase().trim();

			// see if text/msg matches any keywords and respond with corresponding movie detail or search foew new movie
			switch (formattedMsg) {
				case "plot":
				case "date":
				case "runtime":
				case "director":
				case "cast":
				case "rating":
					getMovieDetail(senderId, formattedMsg); // create this function
					break;
				default: // if no keywords match formattedMsg, assume input is for movie query
					// goes into default section
					findMovie(senderId, formattedMsg); //create this function
			}
		} else if (message.attachments) { // error is it's an attachment
			sendMessage(senderId, {text: "Sorry, I don't understand your request."});
		}
	}
}

/*
** POST's messages back to Messenger Platform
*/
function sendMessage(recipientId, message) {
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
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
** getMovieDetail >> goes intol './models/movie.js' and searches for the movie details
*/
function getMovieDetail(userId, field) {
	// 'Movie' >> set variable that gives user access to db in './models/movie.js'
	// gets an array of movie details and stores it into 'movie' var
	Movie.findOne({user_id: user_Id}, function(err, movie) {
		if (err) {
			sendMessage(userId, {text: "Something went wrong. Try again later"});
		} else {
			// goes into the returned movie array and into the elem passed by user
			sendMessage(userId, {text: movie[field]});
		}
	});
}

/*
** findMovie >> calls the Open Movie Database API with the following input
*/
function findMovie(userId, movieTitle) {
	// request API from omdapi
	request("http://www.omdapi.com/?type=movie&amp;t=" + movieTitle, function(error, response, body) {
		// if movie found
		if (!error && response.statusCode === 200) {
			// parsing and getting the array of details of movie
			var movieObj = JSON.parse(body);
			if (movieObj.Response === "True") {
				var query = {user_id: userId};
				// put movie details into the update var to be sent to db
				// if userId exists, update, else create new file
				var update = {
					user_id: userId,
					title: movieObj.Title,
					plot: movieObj.Plot,
					date: movieObj.Released,
					runtime: movieObj.Runtime,
					director: movieObj.Director,
					cast: movieObj.Actors,
					rating: movieObj.imdbRating,
					poster_url: movieObj.Poster
				};
				var options = {upsert: true};
				// go into the movie db & update it with info
				Movie.findOneAndUpdate(query, update, options, function(err, mov) {
					if (err) {
						console.log("Database error: " + err);
					} else {
						// create customized message to return to the user
						message = {
							attachment: {
								type: "template",
								payload: {
									//button template >> sends texts and buttons
									template_type: "generic", //template allows user to define an img, title, subtitle and buttons
									elements: [{
										title: movieObj.Title,
										subtitle: "Is this the movie you are looking for?",
										image_url: movieObj.Poster === "N/A" ? "https://placehold.it/350x150" : movieObj.Poster,
										// option choices for the user
										buttons: [{ 
											type: "postback",
											title: "Yes",
											payload: "Correct"
										}, {
											type: "postback",
											title: "No",
											payload: "Incorrect"
										}]
									}]
								}
							}
						};
						sendMessage(userId, message);
					}
				});
			} else {
				console.log(movieObj.Error);
				sendMessage(userId, {text: movieObj.Error});
			}
		} else {
			sendMessage(userId, {text: "Something went wrong. Try again."});
		}
	});
}

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
