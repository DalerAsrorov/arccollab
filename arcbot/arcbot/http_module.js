var Xray = require("x-ray");
module.exports = {
  scrape_ytube:function(query,callback){
    console.log("query is "+query);
    var xray = new Xray();
    xray('https://www.youtube.com/results?search_query=' + query,'.yt-uix-sessionlink.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.spf-link ',[{
        a:'',
        href:'@href'

    }])(function(err,title){
        console.log(title);
        callback(title);
    })

  }
}


// var Xray = require("x-ray");
// var xray = new Xray();
// xray('https://www.youtube.com/results?search_query=hello','.yt-uix-sessionlink.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.spf-link ',[{
//     a:'',
//     href:'@href'
//
// }])(function(err,title){
//     console.log(title);
// })
