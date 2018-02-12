const API_AI_TOKEN = process.env.API_ACCESS_TOKEN;
const apiAiClient = require('apiai')(API_AI_TOKEN);

const sendTextMessage = require('./sendTextMessage');

module.exports = (event) => {
    // takes message recieved and returns proper response
    const senderId = event.sender.id;
    const message = event.message.text;

    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'test_bot'});

    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;
        sendTextMessage(senderId, result);
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};