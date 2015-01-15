Template.activities_partial.created = function () {

  // 1. Initialization
  
  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(12);
  instance.ready = new ReactiveVar(false);
  
  // 2. Autorun
  
  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var limit = instance.limit.get();

    console.log("Asking for "+limit+" activities…")
    
    // subscribe to the activities publication
    var subscription = Meteor.subscribe('activities', Router.current().params['_id'], limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+limit+" activities. \n\n")
      instance.loaded.set(limit);
      instance.ready.set(true);
    } else {
      instance.ready.set(false);
      console.log("> Subscription is not ready yet. \n\n");
    }
  });
  
  // 3. Cursor
  
  instance.activities = function() { 
    return Activities.find({}, {limit: instance.loaded.get()});
  }
  
};

Template.activities_partial.helpers({
  // the activities cursor
  activities: function () {
    return Template.instance().activities();
  },
  // the subscription handle
  isReady: function () {
    return Template.instance().ready.get();
  },
  // are there more activities to show?
  hasMoreActivities: function () {
    return Template.instance().activities().count() >= Template.instance().limit.get();
  }
});

Template.activities_partial.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();
    
    // get current value for limit, i.e. how many activities are currently displayed
    var limit = instance.limit.get();
    
    // increase limit by 5 and update it
    limit += 12;
    instance.limit.set(limit)
  }
});