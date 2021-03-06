var firebase = require('firebase');
var media = require('./media');
var maps = require('./maps');
var org = require('./org');
var search = require('./search');
module.exports = {

invokeBot : function(message,receiver,success,endpoint,token){
    console.log("bot called");
    console.log("The original message is "+message);
    message = require('./util').preprocess(message);
    console.log("The message after preprocessing is "+message);

    //decide which group the message belongs to
    if(success=="false"){
        console.log("inside success message");
        console.log(endpoint);
        switch(endpoint){
            case "invoke_webmap": maps.invoke_webmap(message,receiver);
                console.log("switch case 1 selected");
                break;
            case "invoke_tweet":media.invoke_tweet(message,receiver);
                console.log("switch case 2 ");
                break;
            case "invoke_search_js":search.invoke_search_js(message,receiver);
                console.log("switch case 3 ");
                break;
            case "invoke_webmappingapplication": maps.invoke_webmappingapplication(message,receiver);
                console.log("switch case 2 selected");
                break;
        }
    }
    else if(message.indexOf('hello') > -1) {
        invoke_hello(receiver);
    }
    else if(message.indexOf('time') > -1) {
        invoke_time(receiver);
    }
    else if(message.indexOf('play') > -1) {
        media.invoke_youtube(message,receiver);
    }
    else if(message.indexOf('credits') > -1){
      org.invoke_credits(message,receiver,token);
    }
    else if(message.indexOf('groups') > -1){
      org.invoke_groups(message,receiver,token);
    }
    else if(message.indexOf('maps') > -1 || message.indexOf('scenes') > - 1){
      search.invoke_maps(message,receiver,token);
    }
    else if(message.indexOf('privileges') > -1){
      org.invoke_privileges(message,receiver,token);
    }
    else if(message.indexOf('search') > -1){
      search.invoke_search_js(message,receiver);
    }
    else if(message.indexOf('map') > -1 && message.indexOf('web') > -1){
      maps.invoke_webmap(message,receiver);
    }
    else if(message.indexOf('layers') > -1 ){
      search.invoke_layers(message,receiver,token);
    }
    else if(message.indexOf('more') > -1 && message.indexOf('info') > -1){
      search.invoke_maps_info(id,receiver,token);
    }
    // else if(message.join(" ").toLowerCase().indexOf('web mapping') > -1){
    //     invoke_webmappingapplication(message,receiver);
    // }
    else if(message.indexOf('web') > -1 && message.indexOf('map') > -1){
        maps.invoke_webmap(message,receiver);
    }
    else if(message.indexOf('tweet') > -1 ){
        media.invoke_tweet(message,receiver);
    }
    else if(message.indexOf('route') > -1 ){
      search.invoke_route(message,receiver,token);
    }
    else{
      console.log("i did not understand");
      var dbRef = firebase.database().ref().child('messages').child(new Date().getTime());
      var obj = {
        user: {
          receiver_userName: [receiver],
          sender_userName: "arcbot"
        },
        text: "I am sorry. I could not understand the command. Why dont you try something else?!",
        success:"true",
        endpoint:""

      }

      dbRef.set(obj);

    }
    // else if(message.toLowerCase().indexOf('credits') > -1){
    //     invoke_credits(message,receiver);
    // }


}
}

function invoke_hello(receiver){
console.log("inside hello");

 var dbRef = firebase.database().ref().child('messages').child(new Date().getTime());
 var obj = {
   user: {
     receiver_userName: [receiver],
     sender_userName: "arcbot"
   },
   text: "Hello!",
   success:"true",
   endpoint:""

 }

 dbRef.set(obj);
}

function invoke_time(receiver){
 var dbRef = firebase.database().ref().child('messages').child(new Date().getTime());
 var obj = {
   user: {
     receiver_userName: [receiver],
     sender_userName: "arcbot"
   },
   text: new Date().toUTCString(),
   success:"true",
   endpoint:""

 }

 dbRef.set(obj);
}
