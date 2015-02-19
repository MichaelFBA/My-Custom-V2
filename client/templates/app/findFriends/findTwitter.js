Template.findTwitter.created = function () {

  // Initialization
  var instance = this;
  // initialize the reactive variables
  instance.twFriends = new ReactiveVar(0);

};

Template.findTwitter.helpers({
    noOfTwitterFriends: function () {
        return Template.instance().twFriends.get().length;
    },

    getTwContacts : function(){
        var tw = Template.instance();
        Meteor.call('getTwitterFriends', function (error, result) {
            if(error){
                console.error(error)
            }
            tw.twFriends.set( result )
        });
        return tw.twFriends.get();
    }
});