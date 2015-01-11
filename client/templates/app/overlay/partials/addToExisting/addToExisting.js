Template.addToExisting.created = function () {
	Meteor.subscribe('wheels', Meteor.userId(), 1000);
};

Template.addToExisting.helpers({
	getWheels: function(){
		return Wheels.find().fetch();
	}
});