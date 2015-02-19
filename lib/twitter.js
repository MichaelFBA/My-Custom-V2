

Meteor.methods({
    getTwitterFriends: function() {
        var Future = Npm.require("fibers/future")
        var future = new Future();

        var config = Meteor.settings.twitter;
        var userConfig = Meteor.user().services.twitter;

        var consumerKey = config.consumerKey;
        var consumerSecret = config.secret;
        var accessToken = userConfig.accessToken;
        var accessTokenSecret = userConfig.accessTokenSecret;

        var Twit = new TwitMaker({
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
            access_token: accessToken,
            access_token_secret: accessTokenSecret
        });

        Twit.get('followers/ids', {
            screen_name: Meteor.user().services.twitter.screenName }, function(error, data, response) {
            if(error){
              console.error(error)
            }else{

              //Check if user exists
              var users = Meteor.users.find({ 'services.twitter.id': { $in: data.ids } });
              future.return( users );

            }
        });

        return future.wait();
    }
});


