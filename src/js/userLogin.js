console.log(  window.sessionStorage.getItem('login'));
var config = {
         apiKey: "AIzaSyB6w2YXSfwIE1E83wT39YrHTODl7QojHWA",
         authDomain: "smartcollab-f40b2.firebaseapp.com",
         databaseURL: "https://smartcollab-f40b2.firebaseio.com",
         storageBucket: "smartcollab-f40b2.appspot.com",
       };
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

      on(dom.byId("sign-in"), "click", function() {
        // user will be redirected to OAuth Sign In page
        console.log('sign in');
        esriId.getCredential(info.portalUrl + "/sharing", {
          oAuthPopupConfirmation: false
        }).then(function() {
          displayItems();
        });

        console.log('got credentials');
      });

      on(dom.byId("sign-out"), "click", function() {
        esriId.destroyCredentials();
        localStorage.removeItem('login');
        window.location.reload();
      });

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
          localStorage.setItem('token', token);
          window.sessionStorage.setItem('login', 'true');
          window.location.replace("http://dalera.esri.com:8000/");
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




      $('#input-chat').keydown(function(event) {
        if (event.keyCode == 13) {
          var text = $('#input-chat').val();


          var dbRef = firebase.database().ref().child('messages');

          var dbRef = firebase.database().ref().child('messages').child(new Date().getTime());

          var obj = {
            user: {
              userName: arcUserMessageInfo.username,
              fullName: arcUserMessageInfo.fullName
            },
            text: text


          }

          dbRef.set(obj);

          $('#input-chat').val('');
        }
      });

      function add_user(portal){

          user_id=portal['user']['username'];
          email=portal['user']['email'];
          full_name=portal['user']['fullName'];
          last_login=portal['user']['lastLogin'];
          org_id=portal['user']['orgId'];


         var usersRef = firebase.database().ref().child("users").child(org_id).child(user_id);

         usersRef.set({
             last_login:last_login,
             email:email,
             full_name:full_name
         });
         //calls presence function
         present(org_id,user_id);
         temp();
         //get_messages();
      }

      function get_messages() {

        var newItems = false;
        var eventsList = new Firebase('https://smartcollab-f40b2.firebaseio.com/messages/');

        eventsList.on('child_added', function(message) {
          if (!newItems) return;
          var message = message.val();

        });
        eventsList.once('value', function(messages) {
          newItems = true;
        });
      }


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

      displayAllMessages();

       function displayAllMessages() {
         var dbRef = firebase.database().ref().child('messages');
         dbRef.on('value', function(snap) {
           var messages = snap.val();
           $('#frame').html('');
           for(var key in messages) {
             $('#frame').append('<div class="message">' + '<span class="message-name">' + messages[key].user.fullName + ": " + '</span>' + messages[key].text +  '</div>');
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
          console.log(org_id);
        var dbRef = firebase.database().ref().child('users').child(org_id);
         dbRef.on('value', function(snap) {
           callback(snap.val());
        });
      }
      function temp() {
        getOnlineUsers(function(data) {
          //var activeUsers = data;
          var arrayOfOrgs = convertToArrayOfOrgs(data);
          //var onlineUsers = convertToArrayOfUsers(arrayOfOrgs);
          console.log(arrayOfOrgs);
          //console.log('array', onlineUsers);

          for(var i = 0; i < arrayOfOrgs.length; i++) {
            $('#list-of-users').append("<li>" + arrayOfOrgs[i].org + "</li>")
          }
        });
      }

    });
