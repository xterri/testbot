const API_AI_TOKEN = process.env.API_ACCESS_TOKEN;
const apiAiClient = require('apiai')(API_AI_TOKEN);

const sendTextMessage = require('./sendTextMessage');

module.exports = (event) => {
    // takes message recieved and returns proper response
    const senderId = event.sender.id;
    const message = event.message.text;

    // sends user messages to API.ai
    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'test_bot'});

    // get and return response message to user
    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;
        sendTextMessage(senderId, result);
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};