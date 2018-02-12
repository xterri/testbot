const processMessage = require('../helpers/processMessage');
const processPostback = require('../helpers/processPostback');

// gets the info / messages from the user and sends to 'processMessage' function
module.exports = (req, res) => {
    console.log(JSON.stringify(req.body));
    res.send(req.body);
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message && event.message.text) {
                    processMessage(event);
                } else if (event.postback) {
                    processPostback(event);
                }
            });
        });
        res.status(200).end();
    }
};