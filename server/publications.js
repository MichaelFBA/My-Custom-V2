//--------------------------------------------------------------------------
// Garage Page
//--------------------------------------------------------------------------
Meteor.publish('getGarage', function(id) {
  return Meteor.users.find({_id: id});
});

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
  var followersCursor = Followers.find({userId: id }, {limit: limit});
  var ids = followersCursor.map(function(p) { return p.followerId });
  return [
  	Followers.find({userId: id }, {limit: limit}),
  	Meteor.users.find({ _id: { $in: ids } }, {limit: limit})
  ]
});

// Publish Following
Meteor.publish('following', function(id, limit) {
  Meteor._sleepForMs(1000);
  var followersCursor = Followers.find({followerId: id}, {limit: limit});
  var ids = followersCursor.map(function(p) { return p.userId });
  return [
    Followers.find({followerId: id }, {limit: limit}),
    Meteor.users.find({ _id: { $in: ids } }, {limit: limit})
  ]
});
// Publish Likes
Meteor.publish('likes', function(id, limit) {
  Meteor._sleepForMs(1000);
  var likesCursor = Likes.find({likedById: id}, {limit: limit});
  var ids = likesCursor.map(function(p) { return p.activityId });
  return [
	Likes.find({likedById: id}, {limit: limit}),
	Activities.find({ _id: { $in: ids } }, {limit: limit})
  ]
});

//--------------------------------------------------------------------------
// Activities Page
//--------------------------------------------------------------------------

Meteor.publish('getActivity', function(id) {
  return Activities.find({_id: id});
});

//--------------------------------------------------------------------------
// Wheels Page
//--------------------------------------------------------------------------

Meteor.publish('getWheels', function(id) {
  return Wheels.find({_id: id});
});


