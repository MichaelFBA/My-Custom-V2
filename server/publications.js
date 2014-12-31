// Publish Wheels
Meteor.publish('wheels', function(id, limit) {
  Meteor._sleepForMs(1000);
  return Wheels.find({userId: id }, {limit: limit});
});

// Publish Activities
Meteor.publish('activities', function(id, limit) {
  Meteor._sleepForMs(1000);
  return Activities.find({userId: id }, {limit: limit});
});

// Publish Followers
Meteor.publish('followers', function(id, limit) {
  Meteor._sleepForMs(1000);
  return Followers.find({userId: id }, {limit: limit});
});

// Publish Following
Meteor.publish('following', function(id, limit) {
  Meteor._sleepForMs(1000);
  return Followers.find({followerId: id}, {limit: limit});
});

// Publish Likes
Meteor.publish('likes', function(id, limit) {
  Meteor._sleepForMs(1000);
  return Likes.find({likedById: id}, {limit: limit});
});


