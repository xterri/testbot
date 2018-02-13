<<<<<<< HEAD
# Dialogflow: Webhook Template using Node.js and Cloud Functions for Firebase

## Setup Instructions

### Steps
1. Deploy the fulfillment webhook provided in the functions folder using [Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/):
   1. Follow the instructions to [set up and initialize Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk). Make sure to select the project that you have previously generated in the Actions on Google Console and to reply `N` when asked to overwrite existing files by the Firebase CLI.
   2. Navigate to the <code>firebase/functions</code> directory and run <code>npm install</code>.
   3. Run `firebase deploy --only functions` and take note of the endpoint where the fulfillment webhook has been published. It should look like `Function URL (yourAction): https://${REGION}-${PROJECT}.cloudfunctions.net/yourAction`
2. Go to the Dialogflow console and select *Fulfillment* from the left navigation menu.
3. Enable *Webhook*, set the value of *URL* to the `Function URL` from the previous step, then click *Save*.
4. Select *Intents* from the left navigation menu. Select the `Default Welcome Intent` intent, scroll down to the end of the page and click *Fulfillment*, check *Use webhook* and then click *Save*. This will allow you to have the welcome intent be a basic webhook intent to test.
5. Build out your agent and business logic by adding function handlers for Dialogflow actions.
=======
# Basic Conversation Bot v.0

This is my first attempt at building a chatbot for the Facebook Messenger platform. Its current version uses DialogFlow (API.ai) to converse with users.

## Getting Started

Based the bot mostly on tutorials and guides found online (see sources).

First version of the bot repeated the messages from the user back to them.

Second version was to pull movie information from [OMDb API](https://www.omdbapi.com). Unfortunately, they no longer provide free access to their database, so could not test the bot properly.

This final version that is currently running is connected to DialogFlow and holds basic conversations with users.

### Demo

The bot is currently connected to my Facebook page, [Terri.Codes](https://www.facebook.com/terri.codes). However, it is still in development mode, so it is not available to the public.

To test the bot, please message me the Facebook account you would like me to add to my list of "Testers".

## Built With

* Node.js
* Express
* Heroku
* DialogFlow (API.ai)
* Facebook Messenger Platform


## Sources

* [CodeGeekLuke - How to create a Chatbot for Facebook Messenger](https://www.youtube.com/watch?v=akyyqrgOTr0)
* [SitePoint - Building a Facebook Chat Bot with Node and Heroku](https://www.sitepoint.com/building-facebook-chat-bot-node-heroku/)
* [Medium - How To Create Your Very Own Facebook Messenger Bot with Dialogflow and Node.js In Just One Day](https://medium.com/crowdbotics/how-to-create-your-very-own-facebook-messenger-bot-with-dialogflow-and-node-js-in-just-one-day-f5f2f5792be5)
* [Build an App for the Google Assistant with Firebase and Dialogflow](https://codelabs.developers.google.com/codelabs/assistant-codelab/index.html?index=..%2F..%2Findex#0)
>>>>>>> a3d0b429a30a55fca4c773bc6d078e93be265aba
