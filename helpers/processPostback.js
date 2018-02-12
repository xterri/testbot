/*
** POSTBACK >> user has clicked a button or something configured to send a postback to bot
*/

module.exports = (event) => {
	var senderId = event.sender.id;
	var payload = event.postback.payload;
	
	if (payload === "Greeting") {
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
				greeting = "Hi " + name + "! ";
			}
			var message = greeting + "I am a Test Bot. I am in development / experimental mode. I will do my best to satisfy my purpose. I will not just be another bot.";
			sendMessage(senderId, {text: message});
		});
	}
}