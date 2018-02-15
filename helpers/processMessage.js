const API_AI_TOKEN = process.env.API_ACCESS_TOKEN;
const apiAiClient = require('apiai')(API_AI_TOKEN);

const sendTextMessage = require('./sendTextMessage');

module.exports = (event) => {
    if (!event.message.is_echo) {

        // takes message recieved and returns proper response
        const senderId = event.sender.id;
        const message = event.message.text;

        console.log(senderId);
        // sends user messages to API.ai
        // will need to change "sessionId" to identify other users
        const apiaiSession = apiAiClient.textRequest(message, {sessionId: senderId});

        // get and return response message to user
        apiaiSession.on('response', (response) => {
            const result = response.result.fulfillment.speech;
            console.log(result);
            sendTextMessage(senderId, result);
        });

        apiaiSession.on('error', error => console.log(error));
        apiaiSession.end();
    }
};