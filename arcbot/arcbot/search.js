var preprocess = require('./util')
var org = require('./org')
var request = require('request')
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
        if(archived_message===undefined){
            //console.log("archived message "+archived_message);
            org.invoke_search_js1(receiver,message.join(" "),time);
        }
        else{
            org.invoke_search_js1(receiver,archived_message.join(" "),time);
            archived_message = undefined;
        }



    }

},
invoke_layers:function(message,receiver,token){
  message = preprocess.remove_stopwords(message);

  //count = preprocess.get_count(message);
  url = "http://www.arcgis.com/sharing/rest/content/items/"+message[0]+"/data?f=json&token="+token
  request({url: url, json: true}, function(err, res, json) {
    if (err) {
      throw err;
    }
    // console.log(json);
    //console.log(json['layers']);
    text = "There are "+json['layers'].length+" layers<br><ul>";
    console.log("There are "+json['layers'].length+" layers");
    for(var i=0;i<json['layers'].length;i++){
        text=text+"<li>"+json['layers'][i]['layerDefinition']['source']['type']+" -> "+json['layers'][i]['name']+"</li>";
    }
    text=text+"</ul>";
    console.log("text ",text);
    preprocess.write_to_db(receiver,text,"true","");
  });

},

invoke_maps:function(message,receiver,token){
  message = preprocess.remove_stopwords(message);

  //count = preprocess.get_count(message);
  console.log(message);
  url = "http://www.arcgis.com/sharing/rest/content/items/"+message[0]+"/data?f=json&token="+token
  request({url: url, json: true}, function(err, res, json) {
    if (err) {
        text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
      preprocess.write_to_db(receiver,text,"true","");
    }
    try{
    console.log(url);
    //console.log(json['layers']);
    text = "There are "+json['operationalLayers'].length+" operational layers<br><ul>";
    console.log("There are "+json['operationalLayers'].length+" layers");
    for(var i=0;i<json['operationalLayers'].length;i++){
        text=text+"<li>"+json['operationalLayers'][i]['layerType']+" -> "+json['operationalLayers'][i]['title']+"</li>";
    }
    text=text+"</ul><br/>";
    text+="Also there is  "+json['baseMap']['baseMapLayers'].length+" base map layer<br><ul>"
    for(var i=0;i<json['baseMap']['baseMapLayers'].length;i++){
        text=text+"<li>"+json['baseMap']['baseMapLayers'][i]['layerType']+"</li>";
    }
    text+="</li>"
    console.log("text ",text);
    preprocess.write_to_db(receiver,text,"true","");
}
catch(err){
    text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
  preprocess.write_to_db(receiver,text,"true","");
}
  });

}


}
