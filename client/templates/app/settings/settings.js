Template.settings.helpers({
	hasPush: function () {
		return Meteor.user() && Meteor.user().profile.notifications;
	},
	hasFB: function () {
		// return Meteor.user() && Meteor.user().services.facebook;
		return false;
	},
	hasTW: function () {
		return Meteor.user() && Meteor.user().services.twitter;
	}
});

Template.settings.events({
	'click #pushNotifications': function (event) {
		var token = $('#pushNotifications').is(':checked');
		Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.notifications': token }} );
	},

	'click #connectFB': function (event) {
		var token = $('#pushNotifications').is(':checked');
		Meteor.connectWith("facebook");
	},

	'click #connectTW': function (event) {
		Meteor.connectWith("twitter");
	},

	'click #logout': function(){
		Meteor.logout();
		Router.go('home');
	}


});