Template.following.created = function () {

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

    console.log("Asking for "+limit+" following…")
    
    // subscribe to the following publication
    var subscription = Meteor.subscribe('following', Meteor.userId(), limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+limit+" following. \n\n")
      instance.loaded.set(limit);
      instance.ready.set(true);
    } else {
      instance.ready.set(false);
      console.log("> Subscription is not ready yet. \n\n");
    }
  });
  
  // 3. Cursor
  
  instance.following = function() { 
    return Followers.find({followerId: Meteor.userId() }, {limit: instance.loaded.get()});
  }
  
};

Template.following.helpers({
  // the following cursor
  following: function () {
    return Template.instance().following();
  },
  // the subscription handle
  isReady: function () {
    return Template.instance().ready.get();
  },
  // are there more following to show?
  hasMoreFollowing: function () {
    return Template.instance().following().count() >= Template.instance().limit.get();
  }
});

Template.following.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();
    
    // get current value for limit, i.e. how many following are currently displayed
    var limit = instance.limit.get();
    
    // increase limit by 5 and update it
    limit += 20;
    instance.limit.set(limit)
  }
});