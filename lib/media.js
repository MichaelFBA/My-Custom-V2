Media = new Meteor.Collection('media');

Media.allow({
    insert: function(userId, doc) {
        return doc.userId === userId;
    }
});

if (Meteor.isServer) {



    Meteor.methods({
        addMedia: function(media, tweet, loc) {
            check(media, {
              type: String,
              make: String,
              model: String,
              year: String,
              description: String,
              image: String,
              b64Data: String
            });
            check(tweet, Boolean);
            check(loc, Match.OneOf(Object, null));

            wheels.userId = Meteor.userId();
            wheels.userAvatar = Meteor.user().profile.picture;
            wheels.userName = Meteor.user().profile.name;
            wheels.date = new Date;

            if (loc){
              wheels.place = getLocationPlace(loc);
            }
            var id = Wheels.insert(wheels);

            if (tweet){
              tweetWheels(wheels);
            }

            return id;
        }
    })
}