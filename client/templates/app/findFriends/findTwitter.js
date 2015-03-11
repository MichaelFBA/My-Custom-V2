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

    isFollowed: function(id){
      // return Meteor.call('isFollowedTwitter', id);
    },

    getTwContacts : function(){
        var tw = Template.instance();
        Meteor.call('getTwitterFriends', function (error, result) {
            if(error){
                console.error(error)
            }else{
                if(result)
                  tw.twFriends.set( result.users )
            }

        });
        return tw.twFriends.get();
    }
});