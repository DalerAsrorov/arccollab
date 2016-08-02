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
        throw err;
      }
    //  console.log(json);
      text = "You are a part of "+json['featuredGroups'].length+" groups.<br><ul>";
      for(var i =0 ;i<json['featuredGroups'].length;i++){
        text+="<li>"+json['featuredGroups'][i]['title']+" by "+json['featuredGroups'][i]['owner']+"</li>";
      }
      text+="</ul>";
      preprocess.write_to_db(receiver,text,"true","");
    });
  },

  invoke_privileges:function(message,receiver,token){
  //    console.log("command : credits");
      url = "https://www.arcgis.com/sharing/rest/portals/self?token="+token+"&f=json"
      request({url: url, json: true}, function(err, res, json) {
        if (err) {
          throw err;
        }
      //  console.log(json);
        text = "You have "+json['user']['privileges'].length+" privileges in total<br><ul>";
        for(var i =0 ;i<json['user']['privileges'].length;i++){
          text+="<li>"+json['user']['privileges'][i]+"</li>";
        }
        text+="</ul>";
        preprocess.write_to_db(receiver,text,"true","");
    });
  },

  invoke_search_js1:function(receiver,query,range){

      url = "https://api.developers.arcgis.com/search?q="+query+"&range="+range
      console.log(url)
      request({url: url, json: true}, function(err, res, json) {
        if (err) {
          throw err;
        }
        //console.log(json);
        text = "You have "+json['total']+" search results.<br><ul>";
        for(var i =0 ;i<json['next'];i++){
          text+="<li>"+json['results'][i]['title']+" <a target='_blank' href=\"  "+json['results'][i]['url']+"\">"+json['results'][i]['url']+"</a></li>";
        }
       text+="</ul>";
        preprocess.write_to_db(receiver,text,"true","");
    });
  }
}
