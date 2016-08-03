var request = require('request');
var preprocess = require('./util');
module.exports={

  invoke_credits:function(message,receiver,token){
      console.log("command : credits");
      url = "https://www.arcgis.com/sharing/rest/portals/self?token="+token+"&f=json"
    request({url: url, json: true}, function(err, res, json) {
      if (err) {
        throw err;
      }
      //console.log(json);
      text = "The Available credits in your subscription for ArcGIS Online are "+json['availableCredits'];
      preprocess.write_to_db(receiver,text,"true","");
    });
  },

  invoke_groups:function(message,receiver,token){
    //  console.log("command : credits");
      url = "https://www.arcgis.com/sharing/rest/portals/self?token="+token+"&f=json"
    request({url: url, json: true}, function(err, res, json) {
      if (err) {
          text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
        preprocess.write_to_db(receiver,text,"true","");
      }
    //  console.log(json);
    try{
      text = "You are a part of "+json['featuredGroups'].length+" groups.<br><ul>";
      for(var i =0 ;i<json['featuredGroups'].length;i++){
        text+="<li>"+json['featuredGroups'][i]['title']+" by "+json['featuredGroups'][i]['owner']+"</li>";
      }
      text+="</ul>";
      preprocess.write_to_db(receiver,text,"true","");
    }
    catch(err){
        text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
      preprocess.write_to_db(receiver,text,"true","");
    }
    });


  },

  invoke_privileges:function(message,receiver,token){
  //    console.log("command : credits");
      url = "https://www.arcgis.com/sharing/rest/portals/self?token="+token+"&f=json"
      request({url: url, json: true}, function(err, res, json) {
        if (err) {
            text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
          preprocess.write_to_db(receiver,text,"true","");
        }
      //  console.log(json);
      try{
        text = "You have "+json['user']['privileges'].length+" privileges in total<br><ul>";
        for(var i =0 ;i<json['user']['privileges'].length;i++){
          text+="<li>"+json['user']['privileges'][i]+"</li>";
        }
        text+="</ul>";
        preprocess.write_to_db(receiver,text,"true","");
    }
    catch(err){
        text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
      preprocess.write_to_db(receiver,text,"true","");
    }
    });
  },

  invoke_search_js1:function(receiver,query,range){

      url = "https://api.developers.arcgis.com/search?q="+query+"&range="+range
      console.log(url)
      request({url: url, json: true}, function(err, res, json) {
        if (err) {
            text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
          preprocess.write_to_db(receiver,text,"true","");
        }
        //console.log(json);
        try{
        text = "You have "+json['total']+" search results retrieved from ArcGIS JavaScript API portal.<br><ul>";
        for(var i =0 ;i<json['next'];i++){
          text+="<li>"+json['results'][i]['title']+"   "+json['results'][i]['url']+"</li>";
        }
       text+="</ul>";
        preprocess.write_to_db(receiver,text,"true","");
    }
    catch(err) {
        text = "Oops! This is embarassing. Something went wrong!! Would you mind trying again??"
        preprocess.write_to_db(receiver,text,"true","");
      }
    });
  }
}
