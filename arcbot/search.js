var preprocess = require('./util')
var org = require('./org')
module.exports ={
  invoke_search_js:function(message,receiver){
    message = preprocess.remove_stopwords(message);
    time = preprocess.get_time_search(message);
    //count = preprocess.get_count(message);
    if(time===undefined){
        preprocess.write_to_db(receiver,"I might find a huge list. Why dont you specify a time? something like today or last week","false","invoke_search_js");
        archived_message = message;
    }
    else if(time != undefined){
        console.log("archived message "+archived_message);
        org.invoke_search_js1(receiver,archived_message.join(" "),time);

            //preprocess.write_to_db(receiver,"I might find a huge list of tweets. Why dont you specify a time? something like latest or yesterday or today","false","invoke_tweet");

    }

  }
}
