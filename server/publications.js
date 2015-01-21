//--------------------------------------------------------------------------
// Home Page
//--------------------------------------------------------------------------
Meteor.publish('latestActivity', function(id, limit) {
  Meteor._sleepForMs(1000);
  //Get Followers IDs
  var followersCursor = Followers.find({followerId: id}, {limit: limit});
  var ids = followersCursor.map(function(val) {
    return val.userId;
  });
  //Get Activity Ids
  var ActivitiesCursor = Activities.find({ userId: { $in: ids } }, {limit: limit})
  var activityIds = ActivitiesCursor.map(function( p ) { return p._id });
  return [
    // Followers.find({followerId: id }, {limit: limit}),
    Activities.find({ userId: { $in: ids } }, {limit: limit}),
    Likes.find({ activityId: { $in: activityIds } }, {limit: limit}),
    Comments.find({ discussion_id: { $in: activityIds } }, {limit: limit}),
  ]
});

Meteor.publish('news', function() {
  return News.find({}, {sort: {date: -1}, limit: 1});
});

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
  return [
    Activities.find({_id: id}),
    Likes.find({activityId: id}),
    Comments.find({discussion_id: id})
  ]
});

//--------------------------------------------------------------------------
// Wheels Page
//--------------------------------------------------------------------------

Meteor.publish('getWheels', function(id) {
  //Get Activities IDs
  var activitiesCursor = Activities.find({wheels: id});
  var activityIds = activitiesCursor.map(function(a) {
    return a._id;
  });

  //Get Wheels IDs
  var wheelsCursor = Wheels.find({_id: id});
  var wheelsId = wheelsCursor.map(function(a) {
    return a._id;
  });
  var allIds = _.union(activityIds,wheelsId)

  return [
      Wheels.find({_id: id}),
      Activities.find({wheels:id}),
      Likes.find({ activityId: { $in: allIds } }),
      Comments.find({ discussion_id: { $in: allIds } })
    ]
});

//--------------------------------------------------------------------------
// Comments
//--------------------------------------------------------------------------

Meteor.publish('getComments', function(id) {
  return Comments.find({discussion_id: id}, {sort: {date: 1}, limit: 100});
});

//--------------------------------------------------------------------------
// Notifications
//--------------------------------------------------------------------------

Meteor.publish('commonUserData', function(id) {
  return [
    Notifications.find({recipientId: this.userId}, {sort: {date: -1}, limit: 100}),
    Meteor.users.find({ _id: this.userId}, {fields: {'services':1}} )
  ];
});

//--------------------------------------------------------------------------
// Search
//--------------------------------------------------------------------------

Meteor.publish('blankSearch', function() {
  return Wheels.find({}, {sort: {date: -1}, limit: 99});
});
