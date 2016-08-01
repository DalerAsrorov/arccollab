var twitter_track = require('./twitter_track');
var preprocess = require('./util');


module.exports = {
    invoke_youtube:function(message,receiver){

        message=message.replace("play video ","");
        console.log("here");
        console.log(message);
        if(message.indexOf('www')>-1){
            url=message;
            console.log(url);
            url=url.replace("watch?v=","embed/");
            text="<iframe class='iframe-style' height=\"390\"  src=\"" +url+ "\" ></iframe>";
            console.log(text);
            write_to_db(receiver,text,"true","");
        }
        else {
            if(message.split(" ").length>1){
                message=message.split(" ");
                message=message.join("+");
            }
            url="http://localhost:5050/youtube/"+message;
            console.log("url"+url);

            $.ajax({
                type: 'GET',
                url: url,
                crossDomain:true,
                success: function( data, textStatus, jQxhr ){
                    console.log( data );
                    url = data[0]['href']
                    url=url.replace("watch?v=","embed/");
                    text="<iframe class='iframe-style' height=\"390\"  src=\"" +url+ "\" ></iframe>";
                    write_to_db(receiver,text,"true","");
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    alert("failed");
                    console.log( errorThrown );
            }
            });

        }
    },

    invoke_tweet:function(message,receiver){
        console.log("Tweets function called");
        message = preprocess.remove_stopwords(message);
        time = preprocess.get_time(message);
        count = preprocess.get_count(message);
        if(time===undefined && count===undefined){
            preprocess.write_to_db(receiver,"I might find a huge list of tweets. Why dont you specify a time? something like latest or yesterday or today","false","invoke_tweet");
            archived_message = message;
        }
        else if(time != undefined && count === undefined){
            console.log("archived message "+archived_message);

            if(time==="latest"){
                console.log(time);
                //console.log("latest tweet");
                //console.log(message);
                twitter_track.twitter_search(archived_message.join(),function(result) {
                    console.log(result);
                    text=result['statuses'][0]['text'];
                    preprocess.write_to_db(receiver,text,"true","");
                });
                //text = tweets[0]['text'];

            }
            else{
                twitter_track.twitter_search(archived_message.join(" ")+" "+time,function(result) {
                    preprocess.write_to_db(receiver,"Got "+result['search_metadata']['count']+" tweets. How many do you want me to display?","false","invoke_tweet");
                    archived_tweet = result;
                    console.log(archived_tweet);
                });
                //preprocess.write_to_db(receiver,"I might find a huge list of tweets. Why dont you specify a time? something like latest or yesterday or today","false","invoke_tweet");

            }

        }
        else{
            max_count = Math.min(count,archived_tweet['search_metadata']['count']);
            text = "<ul>";
            for(var i=0; i<max_count ; i++){
                text +="<li>"+archived_tweet['statuses'][i]['text']+"</li>";
            }
            text += "<ul>";
            preprocess.write_to_db(receiver,text,"true","");
        }

    }
}
