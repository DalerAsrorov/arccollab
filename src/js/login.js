generateJoke();

var allOnlineUsers = [];
var config = {
         apiKey: "AIzaSyB6w2YXSfwIE1E83wT39YrHTODl7QojHWA",
         authDomain: "smartcollab-f40b2.firebaseapp.com",
         databaseURL: "https://smartcollab-f40b2.firebaseio.com",
         storageBucket: "smartcollab-f40b2.appspot.com",
       };
var userSelectedClass = "";

firebase.initializeApp(config);
    var org_id="";
    require([
      "esri/portal/Portal",
      "esri/identity/OAuthInfo",
      "esri/identity/IdentityManager",
      "esri/portal/PortalQueryParams",
      "dojo/dom-style",
      "dojo/dom-attr",
      "dojo/dom",
      "dojo/on",
      "dojo/_base/array",
      "dojo/domReady!"
    ], function(Portal, OAuthInfo, esriId, PortalQueryParams,
      domStyle, domAttr, dom, on, arrayUtils) {
      var info = new OAuthInfo({
        // Swap this ID out with registered application ID
        appId: "cuP0KulXbaqg7MXP",
        // Uncomment the next line and update if using your own portal
        // portalUrl: "https://<host>:<port>/arcgis"
        // Uncomment the next line to prevent the user's signed in state from being shared with other apps on the same domain with the same authNamespace value.
        // authNamespace: "portal_oauth_inline",
        popup: false
      });

      //get_messages();
      var arcUserMessageInfo = null;
      var me = ""

      esriId.registerOAuthInfos([info]);

      esriId.checkSignInStatus(info.portalUrl + "/sharing").then(
        function() {

          displayItems();
        }
      ).otherwise(
        function() {
          // Anonymous view
          // domStyle.set("anonymousPanel", "display", "block");
          // domStyle.set("personalizedPanel", "display", "none");
        }
      );



      // on(dom.byId("sign-in"), "click", function() {
      //   // user will be redirected to OAuth Sign In page
      //   console.log('sign in');
      //   esriId.getCredential(info.portalUrl + "/sharing", {
      //     oAuthPopupConfirmation: false
      //   }).then(function() {
      //     displayItems();
      //   });
      //
      //   console.log('got credentials');
      // });

    //   on(dom.byId("sign-out"), "click", function() {
    //     esriId.destroyCredentials();
    //     localStorage.removeItem('login');
    //     window.location.reload();
    //   });

      function displayItems() {

        var portal = new Portal();
        portal.authMode = "immediate";
        portal.load().then(function() {

          var queryParams = new PortalQueryParams({
            query: "owner:" + portal.user.username,
            sortField: "numViews",
            sortOrder: "desc",
            num: 20
          });

          arcUserMessageInfo = portal.user;
          add_user(portal);
          const token = portal.credential._oAuthCred.token;
        //   localStorage.setItem('token', token);
        //   localStorage.setItem('login', 'true');
        });
      }

      function countProperties(obj) {
          var count = 0;

          for(var prop in obj) {
              if(obj.hasOwnProperty(prop))
                  ++count;
          }

          return count;
      }

      function removeTab() {
        var cssClassOfUserSelectedTab = '.' + userSelectedClass;
        $(cssClassOfUserSelectedTab).remove();
        userSelectedClass = "";
      }

      $("#command-form").submit(function( event ) {
        event.preventDefault();
        var text = $('#input-chat').val();
        //console.log(selected);

        $('.joke-div').remove();
        removeTab();

        var dbRef = firebase.database().ref().child('messages');
        var dbRef = firebase.database().ref().child('messages').child(new Date().getTime());
        value = get_senders(allOnlineUsers,text)
        text_msg=value[0];
        receivers=value[1];
        var obj = {
          user: {
            sender_userName: arcUserMessageInfo.username,
            receiver_userName: receivers
          },
          text: text_msg
        }

        dbRef.set(obj);

        $('#input-chat').val('');
      });

      // $( "#send-command-button" ).click(function() {
      //   var text = $('#input-chat').val();
      //
      //   var dbRef = firebase.database().ref().child('messages');
      //   var dbRef = firebase.database().ref().child('messages').child(new Date().getTime());
      //   value=get_senders(allOnlineUsers,text)
      //   text_msg=value[0];
      //   receivers=value[1];
      //   var obj = {
      //     user: {
      //       sender_userName: arcUserMessageInfo.username,
      //       receiver_userName: receivers
      //     },
      //     text: text_msg
      //   }
      //
      //   dbRef.set(obj);
      //
      //   $('#input-chat').val('');
      // });


      // $('#input-chat').keydown(function(event) {
      //   if (event.keyCode == 13) {
      //
      //   }
      // });

      function getAvatar(email, callback) {
        $.get("/api/gravatar/" + email, function(link) {
          var strUrl = link.toString();
          callback(strUrl);
        });
      }

      function add_user(portal) {
         user_id=portal['user']['username'];
         email=portal['user']['email'];
         full_name=portal['user']['fullName'];
         last_login=portal['user']['lastLogin'];
         org_id=portal['user']['orgId'];
         me=user_id;

         getAvatar(email, function(gravatar) {
            var usersRef = firebase.database().ref().child("users").child(org_id).child(user_id);

            usersRef.set({
                last_login:last_login,
                email:email,
                gravatar: gravatar,
                full_name:full_name
            });
            //calls presence function
            present(org_id,user_id);
            temp();
            //get_messages();
           add_archived_messages(me);
         })

      }

    //   function get_presence() {
      //
    //     var newItems = false;
    //     var eventsList = new Firebase('https://smartcollab-f40b2.firebaseio.com/users/');
      //
    //     eventsList.on('child_added', function(message) {
    //       if (!newItems) return;
    //       var messages = message.val();
    //       console.log(messages);
      //
      //
      //
      //
      //
      //
    //     });
    //     eventsList.once('value', function(messages) {
    //       newItems = true;
    //     });
    //   }


      function present(org_id,user_id){
          var amOnline = new Firebase('https://smartcollab-f40b2.firebaseio.com/.info/connected');
          var userRef = new Firebase('https://smartcollab-f40b2.firebaseio.com/presence/'+org_id+"/" + user_id);
          amOnline.on('value', function(snapshot) {
              if (snapshot.val()) {
                userRef.onDisconnect().remove();
                userRef.set(true);
              }
            });
      }

      displayMyMessages();

       function displayMyMessages() {
         var dbRef = firebase.database().ref().child('messages');
         dbRef.on('value', function(snap) {
           var messages = snap.val();
           //console.log(messages);
           $('#frame').html('');
           for(var key in messages) {
              // console.log(messages[key]);
               if(messages[key]['user']['sender_userName']==me){
                   //console.log("if");
                   $('#frame').append('<div class="message">' + '<span class="message-name">' + "me" + ": " + '</span>' + messages[key].text +  '</div>');
               }
               else{
                   //console.log("if");
                   for(var i=0;i<messages[key]['user']['receiver_userName'].length;i++) {
                       if(messages[key]['user']['receiver_userName'][i] == me){
                           $('#frame').append('<div class="message">' + '<span class="message-name">' + messages[key]['user']['sender_userName'] + ": " + '</span>' + messages[key].text +  '</div>');
                           break;
                       }
                   }
               }
             }

         });
       }

      function convertToArrayOfOrgs(obj) {
        var array = [];
        for(var key in obj) {
          array.push({
            "org": key,
            "info": obj[key]
          })
        }

        return array;
      }

    //   function convertToArrayOfUsers(arrayOfOrgs) {
    //     for(var i = 0; i < arrayOfOrgs.length; i++) {
    //       var infoObj = arrayOfOrgs[i].info;
    //     }
    //   }

      function getOnlineUsers(callback) {
        var dbRef = firebase.database().ref().child('users').child(org_id);
         dbRef.on('value', function(snap) {
           callback(snap.val());
        });
      }


        on(dom.byId("sign-out"), "click", function() {
          esriId.destroyCredentials();
          localStorage.removeItem('login');
          window.sessionStorage.removeItem('login');
          window.sessionStorage.removeItem('token');
          window.location.reload();

        });


      function temp() {
        getOnlineUsers(function(data) {
          $('#list-of-users').html('');
          var arrayOfUsers = convertToArrayOfOrgs(data);
          allOnlineUsers = [];


          for(var i = 0; i < arrayOfUsers.length; i++) {
            allOnlineUsers.push("@" + arrayOfUsers[i].org);

            // open tab for a particular user and
            // attach name to the input field
            getSelectedUser = function(username) {
              var selectUser = 'selected-' + username;
              initializeTab();
              createTabFromSelected(username);
              $('.joke-div').remove();
              refreshTabs();
              $('#input-chat').val('@' + username + ',');

            }

            userSelectedClass = "selected-" + arrayOfUsers[i].org;

            if(arrayOfUsers[i].org==me) {
                $('#list-of-users').append("<li class='select-user' onclick=getSelectedUser(\"" + arrayOfUsers[i].org  + "\")> <img class='gravatar' src=\"" +  arrayOfUsers[i].info.gravatar +  "\"/> <span class='particpant-caption'>" + arrayOfUsers[i].org + " (You)</span> <span class='status'>Online</span></li>");
            }
            else {
                $('#list-of-users').append("<li class='select-user' onclick=getSelectedUser(\"" + arrayOfUsers[i].org  + "\")> <img class='gravatar' src=\"" +  arrayOfUsers[i].info.gravatar +  "\"/> <span class='particpant-caption'>" + arrayOfUsers[i].org + " </span> <span class='status'>Online</span></li>");
            }
          }
          allOnlineUsers.push("@arcbot");
          getAvatar('arcbot@esri.com', function(avatar) {
            $('#list-of-users').append("<li class='bot-li select-user' onclick=getSelectedUser(\"" + "arcbot" + "\")> <img class='gravatar' src=\"" +  avatar +  "\"/> <span class='particpant-caption'>" + 'arcbot' + " </span> <span class='status-arcbot'>Listening...</span></li>");
          });

          // $("#input-chat").autocomplete({
          //   source: allOnlineUsers
          // });
          $("#input-chat")
          .on( "keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB &&
              $(this).autocomplete("instance").menu.active) {
              event.preventDefault();
            }
          })
          .autocomplete({
            minLength: 0,
            source: function( request, response ) {
              // delegate back to autocomplete, but extract the last term
              response($.ui.autocomplete.filter(
                allOnlineUsers, extractLast( request.term ) ) );
            },
            focus: function() {
              // prevent value inserted on focus
              return false;
            },
            select: function( event, ui ) {
              var terms = split( this.value );
              terms.pop();
              console.log(ui.item.value);
              terms.push(ui.item.value );
              terms.push( "" );
              this.value = terms.join( ", " );
              return false;
            }
          });
        });
      }

      function split( val ) {
  			return val.split( /,\s*/ );
  		}

  		function extractLast( term ) {
  			return split( term ).pop();
  		}



      // $(function() {
      //   var availableTags = allOnlineUsers;
      //   $("#input-chat").autocomplete({
      //     source: availableTags
      //   });
      // });


    });
