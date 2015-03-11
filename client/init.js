Meteor.startup(function() {

  //Facebook SDK
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1451011255133475',
      status     : true,
      xfbml      : true,
      version    : 'v2.2'
    });
  };
});
