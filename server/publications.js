// Publish Wheels
Meteor.publish('wheels', function(limit) {
  Meteor._sleepForMs(2000);
  return Wheels.find({}, {limit: limit});
});