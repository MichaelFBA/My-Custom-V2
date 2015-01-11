
Template.home.helpers({
  
  activities: function() {
    return Activities.find();
  },
  
  latestNews: function() {
    return News.latest();
  }
});

Template.home.events({
	'click .js-attach-quick-image': function () {
		Overlay.open('activityOverlay', this);
	}
});