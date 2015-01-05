Template.wheels.created = function () {

  // 1. Initialization
  
  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(5);
  instance.ready = new ReactiveVar(false);
  
  // 2. Autorun
  
  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {

    // get the limit
    var limit = instance.limit.get();

    console.log("Asking for "+limit+" wheels…")
    
    // subscribe to the wheels publication
    var subscription = Meteor.subscribe('wheels', Router.current().params['_id'], limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+limit+" wheels. \n\n")
      instance.loaded.set(limit);
      instance.ready.set(true);
    } else {
      instance.ready.set(false);
      console.log("> Subscription is not ready yet. \n\n");
    }
  });
  
  // 3. Cursor
  
  instance.wheels = function() { 
    return Wheels.find({}, {limit: instance.loaded.get()});
  }
  
};

Template.wheels.helpers({
  // the wheels cursor
  wheels: function () {
    return Template.instance().wheels();
  },
  // the subscription handle
  isReady: function () {
    return Template.instance().ready.get();
  },
  // are there more wheels to show?
  hasMoreWheels: function () {
    return Template.instance().wheels().count() >= Template.instance().limit.get();
  }
});

Template.wheels.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();
    
    // get current value for limit, i.e. how many wheels are currently displayed
    var limit = instance.limit.get();
    
    // increase limit by 5 and update it
    limit += 5;
    instance.limit.set(limit)
  }
});