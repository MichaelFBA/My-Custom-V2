Media = new Meteor.Collection('media');

Media.allow({
    insert: function(userId, doc) {
        return doc.userId === userId;
    }
});

if (Meteor.isServer) {

    Meteor.methods({
        addMedia: function(media, tweet, loc) {

        }
    })
}