// this is where we write our 'business logic'
const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// syntax of how to create a new function
// can make as many functions as you want
exports.helloWorld = functions.https.onRequest((request, response) => {
    
    response.send("Hello from terri's world!");
});

exports.helloWorld2 = functions.https.onRequest((request, response) => {
    
    response.send("Hello from terri's universe!");
});

exports.helloWorld3 = functions.https.onRequest((request, response) => {
    
    response.send("Hello from terri's mind!");
});

