var preprocess = require('./util');
var message_write = require('./firebase_config');
var request = require('request');
module.exports = {

    invoke_webmap:function(message,receiver){
        console.log("Inside web maps");
        message = preprocess.remove_stopwords(message);
        console.log("Query "+message);
        message_length = 0;
        for(var i=0;i<message.length;i++){
            if(message[i]!=""){
                message_length+=1;
            }
        }
        if(message.indexOf('www')>-1){
            url=message;
            console.log(url);
            text="<iframe class='iframe-style map-iframe' src=\"" +url+ "\" ></iframe>";
            //
            console.log(text);
            preprocess.write_to_db(receiver,text,"true","");

        }
        else if(message_length==1 && message[0].length==32){
            console.log("hello im an id");
            url="http://www.arcgis.com/home/webmap/viewer.html?webmap="+message[0];
            text="<iframe class='iframe-style map-iframe' src=\"" +url+ "\" ></iframe>";
            console.log(text);
            preprocess.write_to_db(receiver,text,"true","");
        }
        else if(message_length>=1){
            console.log(message);
            console.log(message.length);
            console.log("keyword found");
            baseURL="http://www.arcgis.com/sharing/rest/search?num=100&sortField=created&sortOrder=desc&f=pjson&q=type:Web%20Map%20"+message.join(" ");
            console.log(baseURL);
            request({url: baseURL, json: true}, function(err, res, json) {
              if (err) {
                  text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
                  preprocess.write_to_db(receiver,text,"true","");
              }
              try{
                id = json['results'][0]['id']; 
                url = "http://www.arcgis.com/home/webmap/viewer.html?webmap="+json['results'][0]['id']

                text="<iframe class='iframe-style map-iframe' src=\"" +url+ "\" ></iframe>";
                preprocess.write_to_db(receiver,text,"true","");
                }
            catch(err){
                text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
                preprocess.write_to_db(receiver,text,"true","");
            }
          });

        }
        else{
            text="Please enter URL /id /keywords";
            preprocess.write_to_db(receiver,text,"false","invoke_webmap");
        }
    }
}

// function invoke_webmappingapplication(message,receiver){
//     console.log("web mapping application");
//     message=message.replace("open web mapping application","");
//
//     console.log(message);
//     split_messages=message.split(" ");
//     for(var i = 0;i<split_messages.length;i++){
//         if(split_messages[i]===''){
//             split_messages.splice(i,1);
//         }
//     }
//     console.log(split_messages);
//     var Exp = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
//
//
//     if(message.indexOf('www')>-1){
//         url=message;
//         console.log(url);
//         //url=url.replace("watch?v=","embed/");
//         text="<iframe class='iframe-style map-iframe' src=\"" +url+ "\" ></iframe>";
//         //
//         console.log(text);
//         write_to_db(receiver,text,"true","");
//
//     }
//     else if(split_messages.length==1 && split_messages[0].match(Exp) && split_messages[0].length==32){
//         console.log("hello im an id");
//         url="http://www.arcgis.com/home/webmap/viewer.html?webmap="+split_messages[0];
//         text="<iframe class='iframe-style map-iframe' src=\"" +url+ "\" ></iframe>";
//         console.log(text);
//         write_to_db(receiver,text,"true","");
//     }
//     else if(split_messages.length>=1){
//
//         console.log("keyword found");
//         baseURL="http://www.arcgis.com/sharing/rest/search?num=100&sortField=created&sortOrder=desc&f=pjson&q=type:Web%20Mapping%20Application%20"+message;
//         console.log(baseURL);
//         $.ajax({
//             type: 'GET',
//
//             url: baseURL,
//             crossDomain:true,
//             dataType:'jsonp',
//             success: function( data, textStatus, jQxhr ){
//
//             console.log( data['results'][0]['id'] );
//
//             url = "http://www.arcgis.com/home/webmap/viewer.html?webmap="+data['results'][0]['id']
//             text="<iframe class='iframe-style map-iframe' src=\"" +url+ "\" ></iframe>";
//             write_to_db(receiver,text,"true","");
//
//             },
//             error: function( jqXhr, textStatus, errorThrown ){
//                 alert("failed");
//                 console.log( errorThrown );
//             }
//         });
//
//     }
//     else{
//         text="Please enter the command with URL/ID/Keywords";
//         console.log("Please enter the command with URL/ID/Keywords");
//         write_to_db(receiver,text,"false","invoke_webmappingapplication");
//
//     }
// }
//

// function invoke_mostpopular_webmap(message,receiver){
//     console.log("Command: most popular web maps");
//     baseURL="http://www.arcgis.com/sharing/rest/search?num=100&start=1&sortField=avgrating&sortOrder=desc&f=pjson&q=type:Web%20Map"
//
//
//     $.ajax({
//         type: 'GET',
//
//         url: baseURL,
//         crossDomain:true,
//         dataType:'jsonp',
//         success: function( data, textStatus, jQxhr ){
//
//         console.log( data['results'][0]['id'] );
//
//         url = "http://www.arcgis.com/home/webmap/viewer.html?webmap="+data['results'][0]['id']
//
//         text="<iframe class='iframe-style map-iframe' src=\"" +url+ "\" ></iframe>";
//         write_to_db(receiver,text,"true","");
//
//     },
//     error: function( jqXhr, textStatus, errorThrown ){
//         alert("failed");
//         console.log( errorThrown );
//     }
//     });
//
//
//
//   }

// function invoke_latest_webmap(message,receiver){
//   console.log("Command: most popular web maps");
//   baseURL="http://www.arcgis.com/sharing/rest/search?num=100&start=1&sortField=modified&sortOrder=desc&f=pjson&q=type:Web%20Map"
//
//
//   $.ajax({
//       type: 'GET',
//
//       url: baseURL,
//       crossDomain:true,
//       dataType:'jsonp',
//       success: function( data, textStatus, jQxhr ){
//
//       console.log( data['results'][0]['id'] );
//
//       url = "http://www.arcgis.com/home/webmap/viewer.html?webmap="+data['results'][0]['id']
//
//       text="<iframe class='iframe-style map-iframe' src=\"" +url+ "\" ></iframe>";
//       write_to_db(receiver,text,"true","");
//
//   },
//   error: function( jqXhr, textStatus, errorThrown ){
//       alert("failed");
//       console.log( errorThrown );
//   }
//   });
//
// }
