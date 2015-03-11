
Meteor.methods({
    isFollowedTwitter: function(id){
        // return Meteor.users.find({"services.twitter.id": id  });
    },

    getTwitterFriends: function() {
        var consumerKey = Meteor.settings.twitter.consumerKey;
        var consumerSecret = Meteor.settings.twitter.secret;
        var accessToken = Meteor.user().services.twitter.accessToken;
        var accessTokenSecret = Meteor.user().services.twitter.accessTokenSecret;

        var Twit = new TwitMaker({
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
            access_token: accessToken,
            access_token_secret: accessTokenSecret
        });

        var response = Async.runSync(function(done) {

            Twit.get('friends/list', { screen_name: Meteor.user().services.twitter.screenName, count:200 }, function(error, data, response) {

                //Get Twitter Friends
                // var twitterIds = _.pluck(data, "id");
                // console.log(data)

                // var users = Meteor.users.find({ 'services.twitter.id': { $in: twitterIds } });

                done(error, data)
            })

        });



        return response.result;

    }
});



// Meteor.methods({
//     getTwitterFriends: function() {
//         // var Future = Npm.require("fibers/future")
//         var future = new Future();

//         var config = Meteor.settings.twitter;
//         var userConfig = Meteor.user().services.twitter;

//         var consumerKey = config.consumerKey;
//         var consumerSecret = config.secret;
//         var accessToken = userConfig.accessToken;
//         var accessTokenSecret = userConfig.accessTokenSecret;

//         var Twit = new TwitMaker({
//             consumer_key: consumerKey,
//             consumer_secret: consumerSecret,
//             access_token: accessToken,
//             access_token_secret: accessTokenSecret
//         });

//         Twit.get('followers/ids', {
//             screen_name: Meteor.user().services.twitter.screenName }, function(error, data, response) {
//             if(error){
//               console.error(error)
//             }else{

//               //Check if user exists
//               var users = Meteor.users.find({ 'services.twitter.id': { $in: data.ids } });
//               future.return( users );

//             }
//         });

//         return future.wait();
//     }
// });
