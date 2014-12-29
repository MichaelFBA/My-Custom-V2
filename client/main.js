if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click .close-button': function () {
       $('.off-canvas').removeClass('is-active')
    },
    'click .open-menu': function(){
      $('.off-canvas').addClass('is-active')
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
