Wheels = new Meteor.Collection('wheels');

// Extended configuration
Wheels.initEasySearch(['description', 'place', 'userName','tags'],{
    'limit' : 200,
    'use' : 'mongo-db'
});

Wheels.allow({
  insert: function(userId, doc) {
    return doc.userId === userId;
  }
});

if (Meteor.isServer) {

Meteor.methods({
  createWheels: function(wheels) {
    // check(Meteor.userId(), String);
    // check(wheels, {
    //   description: String,
    //   image: String,
    //   tweet: Boolean
    // });

    if(wheels.location){
      // check(wheels.location, Match.OneOf(Object, null));
      wheels.place = getLocationPlace(wheels.location);
    }

    wheels.userId = Meteor.userId();
    wheels.userAvatar = Meteor.user().profile.picture;
    wheels.userName = Meteor.user().profile.name;
    wheels.date = new Date;

    if (wheels.tweet){
      tweetWheels(wheels);
    }else{
      delete wheels.tweet
    }

    if(wheels.tags){
      addTags(wheels.tags)
    }

    var id = Wheels.insert(wheels);

    return id;
  }
});



  // Uses the Npm request module directly as provided by the request local pkg
  var callTwitter = function(options) {
    var config = Meteor.settings.twitter
    var userConfig = Meteor.user().services.twitter;

    options.oauth = {
      consumer_key: config.consumerKey,
      consumer_secret: config.secret,
      token: userConfig.accessToken,
      token_secret: userConfig.accessTokenSecret
    };

    return Request(options);
  }

  var tweetWheels = function(wheels) {
    // creates the tweet text, optionally truncating to fit the appended text
    function appendTweet(text, append) {
      var MAX = 117; // Max size of tweet with image attached

      if ((text + append).length > MAX)
        return text.substring(0, (MAX - append.length - 3)) + '...' + append;
      else
        return text + append;
    }

    // we need to strip the "data:image/jpeg;base64," bit off the data url
    var image = wheels.b64Data;

    var response = callTwitter({
      method: 'post',
      url: 'https://upload.twitter.com/1.1/media/upload.json',
      form: { media: image }
    });

    if (response.statusCode !== 200)
      throw new Meteor.Error(500, 'Unable to post image to twitter');

    var attachment = JSON.parse(response.body);

    var response = callTwitter({
      method: 'post',
      url: 'https://api.twitter.com/1.1/statuses/update.json',
      form: {
        status: appendTweet(wheels.description, ' #mycustom'),
        media_ids: attachment.media_id_string
      }
    });

    if (response.statusCode !== 200)
      throw new Meteor.Error(500, 'Unable to create tweet');
  }

  var getLocationPlace = function(loc) {
    var url = 'http://nominatim.openstreetmap.org/reverse?format=json'
    + '&lat=' + loc.coords.latitude
    + '&lon=' + loc.coords.longitude
    + '&zoom=18&addressdetails=1';

    var result = HTTP.call("GET", url);
    return result && result.data.address.suburb + ', ' +result.data.address.country;
  }
}


