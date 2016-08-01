var firebase = require('firebase')
var invoke_bot = require('./main')
var archived_message ="";
var archived_tweet ="";
var config = {
    apiKey: "AIzaSyB6w2YXSfwIE1E83wT39YrHTODl7QojHWA",
    authDomain: "smartcollab-f40b2.firebaseapp.com",
    databaseURL: "https://smartcollab-f40b2.firebaseio.com",
    storageBucket: "smartcollab-f40b2.appspot.com",
};
firebase.initializeApp(config);

//add bot to users
var usersRef = firebase.database().ref().child("users");
usersRef.set({
    arcbot: {
        name:"arcbot"
    }
});

//add bot to online users
online();
function online(){
    var amOnline = firebase.database().ref().child('.info/connected');
    var userRef = firebase.database().ref().child('presence/arcbot');
    amOnline.on('value', function(snapshot) {
    if (snapshot.val()) {
        userRef.onDisconnect().remove();
        userRef.set(true);
    }
    });
}

//read all the messages
get_messages();
function get_messages(){

    console.log("inside get messages");
    var newItems = false;
    var eventsList = firebase.database().ref().child('messages');
    //called when new messages are added
    eventsList.on('child_added', function(message) {
        if (!newItems) return;
        sender=message.val()['user']['sender_userName'];
        var text_message = message.val()['text'];
        for (var i=0;i<message.val()['user']['receiver_userName'].length;i++){
            if(message.val()['user']['receiver_userName'][i].indexOf('arcbot') > -1) {
                console.log(invoke_bot);
                invoke_bot.invokeBot(text_message,sender,message.val()['success'],message.val()['endpoint'],message.val()['token']);
                //
                //
            }
        }
    });
    //called for the archived messages
    eventsList.once('value', function(messages) {
        newItems = true;
    });
}
