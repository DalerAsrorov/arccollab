var usersIncluded = [];
function add_archived_messages(me){
    var newItems = false;
    var eventsList = new Firebase('https://smartcollab-f40b2.firebaseio.com/messages/');

    eventsList.on('child_added', function(message) {
      if (!newItems) return;
      key=message.key();
      date=new Date(parseFloat(key));
      var message = message.val();
      var text = message['text'];
      var receiverName = message['user']['receiver_userName'][0];
      var senderName = message['user']['sender_userName'];
      var receiverIsTabbed = $.inArray(receiverName, usersIncluded);
      var senderIsTabbed = $.inArray(senderName, usersIncluded);
      console.log("inside child added");
      console.log("receiver Name "+receiverName);
      console.log("tab count "+receiverIsTabbed);
      console.log("users included "+usersIncluded);
      var nDate = (date.getMonth() + 1)+ "/" +date.getDate()+"/"  +date.getFullYear() + " " + date.getHours() + ":" +date.getMinutes() + ":" +date.getSeconds();
      //for(var each_receiverName in receiverName){
        if(senderName === me && receiverIsTabbed >= 0) {
          console.log("ep1");
          //addExistingMessage(text, date, senderName);
          $("div " + "#" +  receiverName).append( '<div class="frame">me:' + nDate + ": " + text + ' </div>');
          refreshTabs();
        }
        else if(senderName === me && receiverIsTabbed < 0){
          initializeTab();
          createTab(receiverName);
          //addNewMessage(text, date, senderName);
          var tabUserId = receiverName;
          $('#tabs ').append('<div style="display: block;" id=\"' + tabUserId + '\"' + ' class="tab-frame">' + '<div class="frame">me:' +
            nDate + ": " + text
              + ' </div>' + '</div>');
          refreshTabs();
          usersIncluded.push(receiverName);
        }

    //for(var each_receiverName in receiverName){
      if(receiverName === me && senderIsTabbed >= 0)
      {

        console.log("gjjska");
        $("div " + "#" +  senderName).append( '<div class="frame">' + senderName+" "+ nDate + ": " + text + ' </div>');
        //refreshTabs();
      }
      else if(receiverName === me && senderIsTabbed < 0){
        console.log("ghjsll");
          initializeTab();
          createTab(senderName);
          //addNewMessage(text, date, senderName);
          var tabUserId = senderName;
          $('#tabs ').append('<div style="display: block;" id=\"' + tabUserId + '\"' + ' class="tab-frame">' + '<div class="frame">'+
          senderName +" "+ nDate + ": " + text
              + ' </div>' + '</div>');
          refreshTabs();
          usersIncluded.push(senderName);
      }
  //  }



      // if(messages['user']['sender_userName']==me){
      //     $('#frame').append('<div class="message">' + '<span class="message-name">' + "me" + ": " + '</span>' + messages.text +  '<p>'+ (date.getMonth() + 1)+ "/" +date.getDate()+"/"  +date.getFullYear() + " " + date.getHours() + ":" +date.getMinutes() + ":" +date.getSeconds()+'</p></div>');
      // }
      // else{
      //     //console.log("if");
      //     //console.log(messages['user']['receiver_userName']);
      //     for(var i=0;i<messages['user']['receiver_userName'].length;i++){
      //         if(messages['user']['receiver_userName'][i]==me){
      //             $('#frame').append('<div class="message">' + '<span class="message-name">' + messages['user']['sender_userName'] + ": " + '</span>' + messages.text +  '<p>'+ (date.getMonth() + 1)+ "/" +date.getDate()+"/"  +date.getFullYear() + " " + date.getHours() + ":" +date.getMinutes() + ":" +date.getSeconds()+'</p></div>');
      //             break;
      //         }
      //     }
      // }



    });
    eventsList.once('value', function(messages) {
      newItems = true;
    //   var messages = messages.val();
    //   var testMe = "Arcbot";
    //   for(var key in messages) {
    //     var receiverName = messages[key]['user']['receiver_userName'][0];
    //     var senderName = messages[key]['user']['sender_userName'];
    //     var text = messages[key]['text'];
    //     var senderIsTabbed = $.inArray(senderName, usersIncluded);
    //     date=new Date(parseFloat(key));
    //
    //     if(receiverName === me && senderIsTabbed > 0)
    //     {
    //       addExistingMessage(text, date, senderName);
    //       refreshTabs();
    //     }
    //     else if(receiverName === me && senderIsTabbed < 0)
    //     {
    //       initializeTab();
    //       createTab(senderName);
    //       addNewMessage(text, date, senderName);
    //       refreshTabs();
    //       usersIncluded.push(senderName);
    //     }
    //
    //   } // for loop ends
     });
}

function refreshTabs() {
  console.log("ep3");
  $( "#tabs" ).tabs('refresh');
};

function addExistingMessage(text, date, senderName) {
  console.log("ep2");
  $("div " + "#" +  senderName).append( '<div class="frame">' + date + ": " + text + ' </div>');
}

function initializeTab() {
  $( "#tabs" ).tabs();
  var tabs = $( "#tabs" ).tabs();
    tabs.find( ".ui-tabs-nav" ).sortable({
     axis: "x",
     stop: function() {
       tabs.tabs( "refresh" );
     }
  });
}

function addNewMessage(text, date, senderName) {
  var tabUserId = senderName;
  $('#tabs ').append('<div style="display: block;" id=\"' + tabUserId + '\"' + ' class="tab-frame">' + '<div class="frame">me:' + date + ": " + text
      + ' </div>' + '</div>');
}

// creating new tab with jQuery
function createTab(senderName) {
   $('#user-tab').append('<li class="current-active"><a href=\"' + '#' + senderName +  '\">' + senderName + '</a></li>');
   // adding the frame with the content
}

function generateJoke() {
  $.get("http://api.icndb.com/jokes/random", function(data) {
    if(data.type === 'success') {
      var category = data.value.categories[0];
      var joke = data.value.joke;

    } else {

    }
    console.log('joke');
    console.log(data);
  });
}
