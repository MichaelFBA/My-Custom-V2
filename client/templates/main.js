

Template.hello.events({
  'click .close-button': function () {
     $('.off-canvas').removeClass('is-active')
  },
  'click .open-menu': function(){
    $('.off-canvas').addClass('is-active')
  }
});


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
