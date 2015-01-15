Template.wheels.helpers({
	relatedActivities: function () {
		return Activities.find({wheels:this._id}).fetch();
	}
});