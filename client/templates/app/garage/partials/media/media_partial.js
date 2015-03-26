Template.media_partial.created = function () {

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

    console.log("Asking for "+limit+" media…")

    // subscribe to the media publication
    var subscription = Meteor.subscribe('media', Router.current().params['_id'], limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received "+limit+" media. \n\n")
      instance.loaded.set(limit);
      instance.ready.set(true);
    } else {
      instance.ready.set(false);
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.media = function() {
    return Media.find({}, {limit: instance.loaded.get()});
  }

};

Template.media_partial.helpers({
  // the media cursor
  media: function () {
    return Template.instance().media();
  },
  // the subscription handle
  isReady: function () {
    return Template.instance().ready.get();
  },
  // are there more media to show?
  hasMoremedia: function () {
    return Template.instance().media().count() >= Template.instance().limit.get();
  }
});

Template.media_partial.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many media are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += 5;
    instance.limit.set(limit)
  }
});