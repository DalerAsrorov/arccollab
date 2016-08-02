var Twitter = require('twitter');
module.exports = {
    twitter_search:function(query,callback){
        console.log("inside twitter end point "+query);
        var client = new Twitter({
            consumer_key: 'Xzdi8RrafKpVD3PP2VXM5wVgz',
            consumer_secret: 'EkKstfyXkHpQPqwIMsSDFJw8C7UdgEHM6lb8zra7DY8f64lD1j',
            access_token_key: '738213950278369280-1r70HvztTnizxwOTaFn6S2uXPWAjG0z',
            access_token_secret: 'OCVcgeIY4TeP5CkcMgpsdnMWEqxvCrqjIWZjYaLuhXNTM'
        });

        client.get('search/tweets', {q: query,count:100}, function(error, tweets, response) {
            if (!error) {
                //console.log("tweets "+tweets);
                callback(tweets);
            }
        });

    }
}


    //
    // console.log("inside twitter end point");
    // var client = new Twitter({
    //     consumer_key: 'Xzdi8RrafKpVD3PP2VXM5wVgz',
    //     consumer_secret: 'EkKstfyXkHpQPqwIMsSDFJw8C7UdgEHM6lb8zra7DY8f64lD1j',
    //     access_token: '738213950278369280-1r70HvztTnizxwOTaFn6S2uXPWAjG0z',
    //     access_token_secret: 'OCVcgeIY4TeP5CkcMgpsdnMWEqxvCrqjIWZjYaLuhXNTM'
    // });
    //
    // client.get('search/tweets', {q: "hello since:2014-07-07"}, function(error, tweets, response) {
    //     if (!error) {
    //         console.log(tweets);
    //         return tweets;
    //     }
    // });
