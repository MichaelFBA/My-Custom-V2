Template.followers.created = function () {

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

    console.log("Asking for "+limit+" followers…")
    
    // subscribe to the followers publication
    var subscription = Meteor.subscribe('followers', limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+limit+" followers. \n\n")
      instance.loaded.set(limit);
      instance.ready.set(true);
    } else {
      instance.ready.set(false);
      console.log("> Subscription is not ready yet. \n\n");
    }
  });
  
  // 3. Cursor
  
  instance.followers = function() { 
    return Followers.find({}, {limit: instance.loaded.get()});
  }
  
};

Template.followers.helpers({
  // the followers cursor
  followers: function () {
    return Template.instance().followers();
  },
  // the subscription handle
  isReady: function () {
    return Template.instance().ready.get();
  },
  // are there more followers to show?
  hasMoreFollowers: function () {
    return Template.instance().followers().count() >= Template.instance().limit.get();
<<<<<<< HEAD
  },
  getUserImage: function(id){
    return Meteor.users.findOne(id).profile.picture;
  },
  getUserName: function(id){
    return Meteor.users.findOne(id).profile.name;
=======
>>>>>>> FETCH_HEAD
  }
});

Template.followers.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();
    
    // get current value for limit, i.e. how many followers are currently displayed
    var limit = instance.limit.get();
    
    // increase limit by 5 and update it
    limit += 12;
    instance.limit.set(limit)
  }
});