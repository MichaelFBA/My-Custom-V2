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

  var likesCursor = Likes.find({likedById: id}, {limit: limit});
  var ids = likesCursor.map(function(p) { return p.activityId });
  console.log(ids)
  // return Activities.find({ _id: { $in: ids } }, {limit: limit});
  return [
  	Likes.find({likedById: id}, {limit: limit}),
  	Activities.find({ _id: { $in: ids } }, {limit: limit})
  ]

});


// var likesCursor = Followers.find({likedById: id}, {limit: limit});
// var usersIds = likesCursor.map(function(p) { return p.userId });
// usersIds.push(this.userId);
// return Activities.find({ userId: { $in: usersIds } },{sort: {date: -1}, limit: 100 } );

