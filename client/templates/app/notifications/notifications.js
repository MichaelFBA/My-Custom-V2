Template.notifications.events({
	'click .note': function (event) {
		Notifications.update({_id:this._id}, { $set: { isRead : true  } })
	},
	'click .markAsRead': function(){
		Meteor.call('markAllAsRead');
	}
});

Template.notifications.helpers({
	getNotifications: function () {
		return Notifications.find({recipientId: Meteor.userId() }, {sort: {date: -1}});
	}
});