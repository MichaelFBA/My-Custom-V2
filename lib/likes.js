Likes = new Meteor.Collection('likes');

Meteor.methods({
  'likeActivity': function(id) {
    check(this.userId, String);
    check(id, String);
    Likes.insert({wheelsId: id, likedById: this.userId, userName: Meteor.user().profile.name });
  },
  'unlikeActivity': function(id) {
    check(this.userId, String);
    check(id, String);
    Likes.remove({wheelsId: id, likedById: this.userId });
    }
});