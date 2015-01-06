Template.activity.created = function () {

  // 1. Initialization
  
  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(20);
  instance.ready = new ReactiveVar(false);
  
  // 2. Autorun
  
  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var limit = instance.limit.get();

    console.log("Asking for "+limit+" activity")
    
    // subscribe to the activity publication
    var subscription = Meteor.subscribe('latestActivity', Meteor.userId(), limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+limit+" activity. \n\n")
      instance.loaded.set(limit);
      instance.ready.set(true);
    } else {
      instance.ready.set(false);
      console.log("> Subscription is not ready yet. \n\n");
    }
  });
  
  // 3. Cursor
  
  instance.activity = function() { 
    return Activities.find({}, {limit: instance.loaded.get()});
  }
  
};

Template.activity.helpers({
  // the activity cursor
  activity: function () {
    return Template.instance().activity();
  },
  // the subscription handle
  isReady: function () {
    return Template.instance().ready.get();
  },
  // are there more activity to show?
  hasMoreActivity: function () {
    return Template.instance().activity().count() >= Template.instance().limit.get();
  },
  getUserImage: function(id){
    return Meteor.users.findOne(id).profile.picture;
  },
  getUserName: function(id){
    return Meteor.users.findOne(id).profile.name;
  },

  likeCount:function(){
	return Likes.find({activityId : this._id}).count();
  },

  isliked : function(){
	return Likes.find({activityId: this._id, likedById: Meteor.userId()  }).fetch();
  }

});

Template.activity.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();
    
    // get current value for limit, i.e. how many activity are currently displayed
    var limit = instance.limit.get();
    
    // increase limit by 5 and update it
    limit += 20;
    instance.limit.set(limit)
  },

  'click #like': function(event) {
		event.preventDefault();
		Meteor.call('likeActivity', this._id);

		var notification = {
			recipientId : this.userId,
			activityType: 'like',
			objectId: this._id,
			objectType: 'activity'
		}
		Meteor.call('createNotification', notification);
	},

	'click #unlike': function(event) {
		Meteor.call('unlikeActivity', this._id);

		var notification = {
			recipientId : this.userId,
			activityType: 'like',
			objectId: this._id,
			objectType: 'activity'
		}
        Meteor.call('removeNotification', notification);
	}

});