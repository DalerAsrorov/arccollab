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
  try{
    text = "There are "+json['layers'].length+" layers<br><ul>";
    console.log("There are "+json['layers'].length+" layers");
    for(var i=0;i<json['layers'].length;i++){
        text=text+"<li>"+json['layers'][i]['layerDefinition']['source']['type']+" -> "+json['layers'][i]['name']+"</li>";
    }
    text=text+"</ul>";
    console.log("text ",text);
    preprocess.write_to_db(receiver,text,"true","");
  }
  catch(err){
      text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
    preprocess.write_to_db(receiver,text,"true","");
  }
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

},


invoke_maps_info:function(message,receiver,token){
// message = preprocess.remove_stopwords(message);

  //count = preprocess.get_count(message);
  console.log(message);
  url = "http://www.arcgis.com/sharing/rest/content/items/"+message+"/data?f=json&token="+token
  request({url: url, json: true}, function(err, res, json) {
    if (err) {
        text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
      preprocess.write_to_db(receiver,text,"true","");
    }
    try{
        url_meta = 'http://www.arcgis.com/sharing/rest/content/items/'+message+'?f=json'
        request({url: url_meta, json: true}, function(err, res, json1) {
          if (err) {
              text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
            preprocess.write_to_db(receiver,text,"true","");
          }
          text = "This is a "+json1['type']+" called "+json1['title']+" created on "+new Date(new Date(json1['created']))+"<br><br>";
          //return text;
         // text = get_meta();
          console.log(url);
          //console.log(json['layers']);
          text += "There are "+json['operationalLayers'].length+" operational layers<br><ul>";
          console.log("There are "+json['operationalLayers'].length+" layers");
          for(var i=0;i<json['operationalLayers'].length;i++){
              text=text+"<li>"+json['operationalLayers'][i]['layerType']+" -> "+json['operationalLayers'][i]['title']+"</li>";
          }
          text=text+"</ul><br/>";
          text+="Also there are  "+json['baseMap']['baseMapLayers'].length+" base map layers<br><ul>"
          for(var i=0;i<json['baseMap']['baseMapLayers'].length;i++){
              text=text+"<li>"+json['baseMap']['baseMapLayers'][i]['layerType']+"</li>";
          }
          text+="</li>"
          console.log("text ",text);
          preprocess.write_to_db(receiver,text,"true","");
      });

}
catch(err){
    text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
  preprocess.write_to_db(receiver,text,"true","");
}
  });
  // function get_meta(){
  //     url_meta = 'http://www.arcgis.com/sharing/rest/content/items/'+message+'?f=json'
  //     request({url: url_meta, json: true}, function(err, res, json) {
  //       if (err) {
  //           text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
  //         preprocess.write_to_db(receiver,text,"true","");
  //       }
  //       text = "This is a "+json['type']+" called "+json['title']+"created on "+new Date(json['created'])+"<br>";
  //       return text;
  //   });
  // }

},

invoke_route:function(message,receiver,token){
    console.log("hello! inside invoke route");
    message = preprocess.remove_stopwords(message);
    from = message.indexOf("from");
    to = message.indexOf("to");
    console.log(from);
    console.log(to);
    source = message.slice(from+1,to);
    dest = message.slice(to+1,message.length);
    console.log(source);
    console.log(dest);
    url = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?text="+source+"&f=json"
    console.log(url);
    request({url: url, json: true}, function(err, res, json) {
    if (err) {

    }
    source_x = parseFloat(json['locations'][0]['feature']['geometry']['x']);
    source_y = parseFloat(json['locations'][0]['feature']['geometry']['y']);
    geocode_dest();
  });

function geocode_dest(){
  url = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?text="+dest+"&f=json"
      console.log(url);
  request({url: url, json: true}, function(err, res, json) {
  if (err) {

        text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
      preprocess.write_to_db(receiver,text,"true","");


  }
  try{
    dest_x = parseFloat(json['locations'][0]['feature']['geometry']['x']);
    dest_y = parseFloat(json['locations'][0]['feature']['geometry']['y']);
    get_directions()
  }
  catch(err) {
      text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
    preprocess.write_to_db(receiver,text,"true","");
  }
});
}
function get_directions(){
    url = "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?stops="+source_x+","+source_y+";"+dest_x+","+dest_y+"&token="+token+"&f=pjson";
        console.log(url);
    request({url: url, json: true}, function(err, res, json) {
    if (err) {

    }
    // console.log(json);
    text="Found the directions!<br><ul>";
    text+="The total distance to be travelled is "+json['routes']['features'][0]['attributes']['Total_Miles'].toFixed(2)+" miles and might take "+json['routes']['features'][0]['attributes']['Total_TravelTime'].toFixed(2)+" minutes";
    for(var i=0;i<json['directions'][0]['features'].length;i++){
        console.log(json['directions'][0]['features'][i]['attributes']['text']);
        text+="<li>"+json['directions'][0]['features'][i]['attributes']['text']+"</li>"
    }
    text+="</ul>";
    preprocess.write_to_db(receiver,text,"true","");

  });
  }


}



}
