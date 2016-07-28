var Xray = require("x-ray");
module.exports = {
scrape_ytube:function(query,callback){
var xray = new Xray();
xray('https://www.youtube.com/results?search_query='+query,'.yt-uix-sessionlink.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.spf-link ',[{
    a:'',
    href:'@href'

}])(function(err,title){
    callback(title);
})
}
}

// module.exports = {
// scrape_google:function(query,callback){
// var xray = new Xray();
// xray('https://www.google.com/#q='+query,'.yt-uix-sessionlink.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.spf-link ',[{
//     a:'',
//     href:'@href'
//
// }])(function(err,title){
//     callback(title);
// })
// }
// }
