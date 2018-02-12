const request = require('request');

const sendTextMessage = require('./sendTextMessage');

module.exports = (event) => {
	const senderId = event.sender.id;
	const payload = event.postback.payload;
	
	if (payload === "Greeting") {
		request({
			url: "https://graph.facebook.com/v2.6/" + senderId,
			qs: {
				access_token: process.env.PAGE_ACCESS_TOKEN,
				fields: "first_name",
				fields: "languages"
			},
			method: "GET"
		}, function(error, response, body) {
			var greeting = "";
			if (error) {
				console.log("Error getting user's name: " + error);
			} else {
				var bodyObj = JSON.parse(body);
				name = bodyObj.first_name;
				lang = bodyObj.locale;
				greeting = "Hi " + name + " . " + lang + "! ";
			}
			var message = greeting + "I am a Test Bot. I am in development / experimental mode. I will do my best to satisfy my purpose. I will not just be another bot.";
			sendTextMessage(senderId, message);
		});
	}
};