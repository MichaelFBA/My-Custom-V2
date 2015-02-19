Meteor.startup(function() {
  // Potentially prompts the user to enable location services. We do this early
  // on in order to have the most accurate location by the time the user shares
  Geolocation.currentLocation();

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
