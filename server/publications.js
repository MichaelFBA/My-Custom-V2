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
Meteor.publish('followers', function(limit) {
  Meteor._sleepForMs(1000);
  var followersCursor = Followers.find({userId: this.userId }, {limit: limit});
  var ids = followersCursor.map(function(p) { return p.followerId });
  console.log('followers', ids)
  return [
  	Followers.find({userId: this.userId }, {limit: limit}),
  	Meteor.users.find({ _id: { $in: ids } }, {limit: limit})
  ]
});

// Publish Following
Meteor.publish('following', function(limit) {
  Meteor._sleepForMs(1000);
  var followersCursor = Followers.find({followerId: this.userId}, {limit: limit});
  var ids = followersCursor.map(function(p) { return p.userId });
  console.log('following', ids)

  return [
    Followers.find({followerId: this.userId }, {limit: limit}),
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


// var likesCursor = Followers.find({likedById: id}, {limit: limit});
// var usersIds = likesCursor.map(function(p) { return p.userId });
// usersIds.push(this.userId);
// return Activities.find({ userId: { $in: usersIds } },{sort: {date: -1}, limit: 100 } );

//Get Activities
Meteor.publish('getActivity', function(id) {
  return Activities.find({_id: id});
});

