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
    // don't get intentName because it can be easily edited, use action identifier instead
    let actionName = request.body.result.action;
    let userId = request.body.sessionId; 

    switch (actionName) {
        case "SaveTasks":
            let params = request.body.result.parameters;
            let saveToDb = {
                id: userId,
                due: params.due,
                subject: params.subject
            };
            // db currently saving ALL data from ALL users, need to separate them
            // collection on fire >> see Firebase Guides >> Cloud Firestore >> Get Started
            // adds params to firebase/firestore db
            firestore.collection('tasks').add(saveToDb) 
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
                .catch((e => {
                    console.log("error: " + e);
                    response.send({
                        speech: "Something went wrong when writing to the database"
                    });
                }))
            break;
        case "countTasks":
            firestore.collection('tasks').get()
                // "querySnapshot" = an iteration (doesn't return / have data)
                .then((querySnapshot) => {
                    var tasks = [];
                    var index = 0;
                    // get data from db and store array into tasks var
                    querySnapshot.forEach((doc) => { tasks.push(doc.data()) });
                    // tasks returned look like >> [ {...}, {...}, {...} ]
                    tasks.forEach((eachTask) => {
                        if (eachTask.id === userId)
                            index++;
                    });
                    var speech = `You have ${index} task(s). `;
                    speech += index ? "Would you like to see them?" : "";
                    response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log("Error getting documents from db", err);
                    response.send({
                        speech: "An error occured while retrieving information from the database"
                    })
                });
            break;
        case "ShowTasks":
            firestore.collection('tasks').get()
                // "querySnapshot" = an iteration (doesn't return / have data)
                .then((querySnapshot) => {
                    var tasks = [];
                    var index = 0;
                    // get data from db and store array into tasks var
                    querySnapshot.forEach((doc) => { tasks.push(doc.data()) });
                    // tasks returned look like >> [ {...}, {...}, {...} ]

                    // convert array to speech
                    var speech = "";

                    tasks.forEach((eachTask) => {
                        if (eachTask.id === userId) {
                            // get each object stored into "eachTask", and an index val starting at 0
                            speech += `${index + 1}) Your ${eachTask.subject} homework is due ${eachTask.due}.\n`
                            index++;
                        }
                    });
                    if (!speech)
                        speech += "Please add some tasks to the list."
                    response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log("Error getting documents from db", err);
                    response.send({
                        speech: "An error occured while retrieving information from the database"
                    })
                });
            break;
        case "Robot":
            response.send({
                speech: "I am Bot I am."
            });
            break;
        case "AboutPurpose":
            response.send({
                speech: "I pass the butter"
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

