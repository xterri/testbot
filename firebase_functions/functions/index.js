
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// this is where we write our 'business logic'
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// using the firebase db in fulfillment
// use '.initializeApp' b/c already running in firebase & functions has the credentials
admin.initializeApp(functions.config().firebase);

// use 'firestore' to interact with file/store db
var firestore = admin.firestore();

// in firebase app page go to db >> choose Cloud Firestore [Beta] >> save as test (?) and enable
    // >> check Rules to see if "allow read, write" is entered

// syntax of how to create a new function
// can make as many functions as you want
exports.webhook = functions.https.onRequest((request, response) => {
    console.log("request.body.result.parameters: " + request.body.result.parameters);
    // should get something like this in return:
        // {
        //     subject: "math",
        //     due: "2018-02-13"
        //     ...
        // }
    let intentName = request.body.result.metadata.intentName;
    let params = request.body.result.parameters;

    switch (intentName) {
        case "homework":
            // collection on fire >> see Firebase Guides >> Cloud Firestore >> Get Started
            // adds params to firebase/firestore db
            firestore.collection('tasks').add(params) 
                // params >> {subject: "math", due: "2018-02-11"}
                    // adding the param object
                .then(() => {
                    response.send({
                        // must use back ticks ( ` ) if calling on js elements inside string
                        speech: 
                            `Save is complete. Your ${params.subject} homework is due ${params.due}`
                    });
                })
                // catch any errors that occur
                .catch(e => {
                    console.log("error: " + e);
                    response.send({
                        speech: "Something went wrong when writing to the database"
                    });
                })
            break;
        case "AreYouARobot":
            response.send({
                speech: "I am Bot I am."
            });
            break;
        default:
            response.send({
                speech: "Bot malfunction"
            });
    }

});
// to check db results, go to the app's database and click on "Data"

// each export = different webhook/url given

// exports.helloWorld2 = functions.https.onRequest((request, response) => {
//     response.send("Hello from terri's universe!");
// });

// exports.helloWorld3 = functions.https.onRequest((request, response) => {
//     response.send("Hello from terri's mind!");
// });

