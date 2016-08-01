var usersIncluded = [];
var msgShareContent = "";
var msgShareSender = "";

$(document).ready(function(e) {
  var s = $("#user-tab");
  var pos = s.position();
  $("#messagesContent").scroll(function(e) {
    // e.preventDefault();
    console.log('scrolling user tab');

      var windowpos = $(window).scrollTop();
      // s.html("Distance from top:" + pos.top + "<br />Scroll position: " + windowpos);
      console.log('windowspos', windowpos);
      console.log('pos.top',  pos.top);
      if (windowpos >= pos.top ) {
          s.addClass("stick-tabs");
      } else {
          s.removeClass("stick-tabs");
      }
  });
});

// this initializes the dialog (and uses some common options that I do)
 $("#guideInfoModal").dialog({
    autoOpen : false,
    modal : true,
    show : "blind",
    hide : "blind",
    width: "80%",
    maxWidth: "840px"
});

// this initializes the dialog (and uses some common options that I do)
 $("#sharePostModal").dialog({
    autoOpen : false,
    modal : true,
    show : "blind",
    hide : "blind",
    width: "60%",
    maxWidth: "840px",
    closeOnEscape: true
});

 // next add the onclick handler
 $("#commands-info-button").click(function() {
   $("#guideInfoModal").dialog("open");
   return false;
 });

$('body').on("click", ".post-hide", function() {
   console.log('click .post-hide');
   var $this = $(this);
   var $parent = $this.parent().parent().parent();
   var $content = $parent.find('.msg-content');
   $content.hide();
});

 $( "body" ).on("click", ".frame", function() {
   var $this = $(this);
   var $me = $this.find('.msgr');
   var sender = $me.text(); // sender
   var $msgContent = $this.find('.msg-content');
   var msgContent = $msgContent.text();

    $('#userShare').empty();
   $('.share-modal-sender').empty();
   $('.share-modal-sender-content').empty();
   $('.share-modal-sender').append("<div class='sender-caption'>" + "<span class='sender-capt'> Sender: </span>"+ me + "</div>");
   $('.share-modal-sender-content').append("<div class='content-caption'> Message: </div>");
   $('.share-modal-sender-content').append("<div class='msg-itself'>" + msgContent + "</div>");

   $("#sharePostModal").dialog("open");
   msgShareContent = msgContent;
   msgShareSender = sender;

 });


$('#sharePostButton').click(function() {
  var msgShareList = $('#userShare').val();
  var msgShareListSplit = msgShareList.split(",");
  console.log(msgShareListSplit);
  var dbRef = firebase.database().ref().child('messages').child(new Date().getTime());
  var obj = {
    user: {
      sender_userName: me,
      receiver_userName: msgShareListSplit
    },
    text: msgShareContent,
    //image: image,
    success: "true",
    endpoint: ""
  }

//  image = "";
  dbRef.set(obj);
  $('#sharePostModal').dialog('close')
});

function add_archived_messages(me){
    var newItems = false;
    var eventsList = new Firebase('https://smartcollab-f40b2.firebaseio.com/messages/');

    eventsList.on('child_added', function(message) {
      if (!newItems) return;
      key=message.key();
      date=new Date(parseFloat(key));
      var message = message.val();
      success = message['success'];
      endpoint = message['endpoint'];
      var text = message['text'];
      var receiverName = message['user']['receiver_userName'][0];
      var senderName = message['user']['sender_userName'];
      var receiverIsTabbed = $.inArray(receiverName, usersIncluded);
      var senderIsTabbed = $.inArray(senderName, usersIncluded);
      console.log("inside child added");
      console.log(message);
      // console.log("receiver Name "+receiverName);
      // console.log("tab count "+receiverIsTabbed);
      // console.log("users included "+usersIncluded);
      // console.log('messageObj', message);
      //var nDate = (date.getMonth() + 1)+ "/" +date.getDate()+"/"  +date.getFullYear() + " " + date.getHours() + ":" +date.getMinutes() + ":" +date.getSeconds();
      var nDate = date.toLocaleString();
      //for(var each_receiverName in receiverName){



      if(senderName === me && receiverIsTabbed >= 0) {
          console.log("1");

          //addExistingMessage(text, date, senderName);
          $("div " + "#" +  receiverName).append( '<div class="frame my-frame"><div class="me-wrapper"> <div class="header-msg"><span class="msgr">Me </span> <span class="msg-date">' + nDate + "</span> </div> <div class='msg-content'>" + text + ' <span class="post-hide glyphicon glyphicon-arrow-up"> </span> <span class="post-hide glyphicon glyphicon-arrow-up"></span> </div> </div> </div>');
          //$( "#tabs" ).tabs({ active: # });
          refreshTabs();
        }
        else if(senderName === me && receiverIsTabbed < 0) {
          console.log("2");
          initializeTab();
          createTab(receiverName);
          //addNewMessage(text, date, senderName);
          var tabUserId = receiverName;

          $('#tabs ').append('<div id=\"' + tabUserId + '\"' + ' class="tab-frame">' + '<div class="frame my-frame"> <div class="me-wrapper"> <div class="header-msg"><span class="msgr">Me </span> <span class="msg-date">' +
            nDate + "</span> <span class='post-hide glyphicon glyphicon-arrow-up'> </div> <div class='msg-content'>" + text
              + '</span> </div> </div> </div>' + '</div>');
          refreshTabs();
          usersIncluded.push(receiverName);
        }

    //for(var each_receiverName in receiverName){
      if(receiverName === me && senderIsTabbed >= 0)
      {
        console.log("3");

        $("div " + "#" +  senderName).append( '<div class="frame"> <div class="header-msg"> <span class="msgr">' + senderName + "</span> <span class='msg-date'>"+ nDate + "</span>  <span class='post-hide glyphicon glyphicon-arrow-up'></span>  </div> <div class='msg-content'>" + text + '</div> </div>');
        //refreshTabs();
      }
      else if(receiverName === me && senderIsTabbed < 0){
        console.log("4");
          initializeTab();
          createTab(senderName);
          //addNewMessage(text, date, senderName);
          var tabUserId = senderName;
          $('#tabs ').append('<div style="display: block;" id=\"' + tabUserId + '\"' + ' class="tab-frame">' + '<div class="frame"> <div class="header-msg"> <span class="msgr">'+
          senderName +" </span> <span class='msg-date'>"+ nDate + "</span>  <span class='post-hide glyphicon glyphicon-arrow-up'></span>  </div> <div class='msg-content'>" + text
              + '</div> </div>' + '</div>');
          refreshTabs();
          usersIncluded.push(senderName);
      }




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

        $('.joke-div').remove();

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
  $( "#tabs" ).tabs('refresh');
};

function addExistingMessage(text, date, senderName) {
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

// function addNewMessage(text, date, senderName) {
//   var tabUserId = senderName;
//   $('#tabs ').append('<div style="display: block;" id=\"' + tabUserId + '\"' + ' class="tab-frame">' + '<div class="frame">me:' + date + ": " + text
//       + ' </div>' + '</div>');
// }

// creating new tab with jQuery
function createTab(senderName) {
  clickTab = function(name) {
    document.getElementById('input-chat').value = '@' + name + ', ';
    console.log('suppose to print', name);
  }
   $('#user-tab').append('<li onclick="clickTab(\'' + senderName + '\')" class="' + senderName +  '\"><a href=\"' + '#' + senderName +  '\">' + senderName + '</a></li>');
   var tabIndex = $('.selected-' + senderName).prop('tabindex');
   // $( "#tabs" ).tabs({active: tabIndex}'option', 'active', tabIndex );
   // adding the frame with the content
}

function createTabFromSelected(usernameCssClass) {
 $('#user-tab').append('<li class="selected-' + usernameCssClass + '"><a href=\"' + '#' + usernameCssClass +  '\">' + usernameCssClass + '</a></li>');
 var tabIndex = $('.selected-' + usernameCssClass).prop('tabindex');
 $( "#tabs" ).tabs('option', 'active', tabIndex);
 console.log('createTabFromSelected()');

}

function generateJoke() {
  $.get("http://api.icndb.com/jokes/random", function(data) {
    if(data.type === 'success') {
      var category = data.value.categories[0];
      var joke = data.value.joke;
      $('#tabs').append('<div class="joke-div">'
      + '<span class="joke-span">\"' + joke + '\"</span>'
      + '</div>')
    } else {

    }
  });
}


var loadFile = function(event) {
  console.log('execute loadFile');
  console.log(event);
   var reader = new FileReader();
   reader.onload = function(){
     image = reader.result;
     console.log(reader.result);
    //  var output = document.getElementById('output');
    //  output.src = reader.result;
   };
   console.log(event.target.files[0]);
   reader.readAsDataURL(event.target.files[0]);
 };

 $('.ui-dialog-titlebar-close').css({
   'font-size' : '10px',
   'background' : '#fff',
   'color' : 'black',
   'line-height': '0.5'
});
 $('.ui-dialog-titlebar-close').append('x');
