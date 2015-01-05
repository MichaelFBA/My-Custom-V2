Template.likes.created = function () {

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

    console.log("Asking for "+limit+" likes…")
    
    // subscribe to the likes publication
    var subscription = Meteor.subscribe('likes', Meteor.userId(), limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+limit+" likes. \n\n")
      instance.loaded.set(limit);
      instance.ready.set(true);
    } else {
      instance.ready.set(false);
      console.log("> Subscription is not ready yet. \n\n");
    }
  });
  
  // 3. Cursor
  
  instance.likes = function() { 
    return Likes.find({ likedById: Meteor.userId() }, {limit: instance.loaded.get()});
  }
  
};

Template.likes.helpers({
  // the likes cursor
  likes: function () {
    return Template.instance().likes();
  },
  // the subscription handle
  isReady: function () {
    return Template.instance().ready.get();
  },
  // are there more likes to show?
  hasMoreLikes: function () {
    return Template.instance().likes().count() >= Template.instance().limit.get();
  },
  //getActivity Image
  getActivityImage: function(id){
    return Activities.findOne(id).image;
  },
  getActivityId: function(id){
    return Activities.findOne(id)._id;
  }
});

Template.likes.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();
    
    // get current value for limit, i.e. how many likes are currently displayed
    var limit = instance.limit.get();
    
    // increase limit by 20 and update it
    limit += 20;

    instance.limit.set(limit)
  }
});