var firebase = require('firebase');
module.exports = {
    preprocess : function(message){
        message = message.replace(/ +(?= )/g,'');
        message = message.split(" ");
        return message;
    },
    remove_stopwords : function(message){
    //    temp = message;
        //console.log("message "+message);
        stop_words = ['open','show','display','web','map','maps','mapping','application','tweet', 'play', 'video', 'tweets','find','for','you','can','search','layers','scenes','layer','scene'];
        for(var i=0; i < stop_words.length; i++){
        //    console.log("stop words "+stop_words[i]);
            if(message.indexOf(stop_words[i]) > -1){
                j = message.indexOf(stop_words[i]);
            //    console.log(j);
                message.splice(j,1);

            }
        }
        return message;
    },
    get_time :function(message){
        console.log("checking time");
        console.log(message);
        var date = new Date();
        if(message.indexOf("latest") > -1){
            // i = message.indexOf("latest");
            // message = message.splice(i,1);
            return "latest";
        }
        else if(message.indexOf("last week")> -1){
          // i = message.indexOf("latest");
          // message = message.splice(i,1);
            date = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
            console.log(date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate());
            return "since:"+date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
        }
        else if(message.indexOf("today")> -1){
          // i = message.indexOf("latest");
          // message = message.splice(i,1);
            console.log(date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate());
            return "since:"+date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
        }
        else if(message.indexOf("yesterday")> -1){
          // i = message.indexOf("latest");
          // message = message.splice(i,1);
            date.setDate(date.getDate() - 1);
            console.log(date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate());
            return "since:"+date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
        }
    },

    get_time_search :function(message){
        console.log("checking time");
        console.log(message);
        if(message.indexOf("week")> -1){
          // i = message.indexOf("latest");
          return "week"
        }
        else if(message.indexOf("today")> -1){

            return "day"
        }
        else if(message.indexOf("year")> -1){
          // i = message.indexOf("
          return "year"
        }
    },

    get_type :function(message){
        console.log("checking type");
        console.log(message);
        if(message.indexOf("web")> -1 && message.indexOf("map")>-1){
          // i = message.indexOf("latest");
          return "web map"
        }
        else if(message.indexOf("web")> -1 && message.indexOf("mapping")>-1 && message.indexOf("application")>-1){

            return "web mapping application"
        }
        // else if(message.indexOf("year")> -1){
        //   // i = message.indexOf("
        //   return "year"
        // }
    },

    write_to_db : function(receiver,text,success,endpoint){
        var dbRef = firebase.database().ref().child('messages').child(new Date().getTime());
        var obj = {
            user: {
                receiver_userName: [receiver],
                sender_userName: "arcbot"
            },
            text: text,
            success:success,
            endpoint:endpoint

        }
        dbRef.set(obj);
    },
    get_count : function(message){
        var numberPattern = /\d+/g;
        for(var i=0;i<message.length;i++){
            if(/^\d+$/.test(message[i])){
                return parseInt(message[i]);
            }
        }
    }
}
