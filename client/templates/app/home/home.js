Template.home.created = function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(10);
  instance.ready = new ReactiveVar(false);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  this.autorun(function () {
    //initalise the video
    // $('video').mediaelementplayer({
    //     success: function(media, node, player) {
    //       $('#' + node.id + '-mode').html('mode: ' + media.pluginType);
    //     }
    //   });

    // get the limit
    var limit = instance.limit.get();

    console.log("Asking for "+limit+" wheels…")

    // subscribe to the wheels publication
    var subscription = Meteor.subscribe('latestActivity', Meteor.userId() , limit);

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
    return Wheels.find({},{sort: {date: -1}, limit: instance.loaded.get()});
  }

};

Template.home.helpers({
  // the wheels cursor
  feed: function () {
    return Template.instance().wheels();
  },
  // the subscription handle
  isReady: function () {
    return Template.instance().ready.get();
  },
  // are there more wheels to show?
  hasMoreActivities: function () {
    return Template.instance().wheels().count() >= Template.instance().limit.get();
  },
  latestNews: function() {
    return News.latest();
  }
});

Template.home.events({
	'click .js-attach-quick-image': function () {
		Overlay.open('activityOverlay', this);
	},

  'click .load-more': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many wheels are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += 10;
    instance.limit.set(limit)
  }
});