var TAB_KEY = 'tabs';
Template.garage.rendered = function() {
    Session.set(TAB_KEY,'Info');
}

Template.garage.helpers({
    notificationCount: function(){
        return Notifications.find({recipientId: Meteor.userId(), isRead:false }).count()
    }, 
    isActiveTab: function(name) {
        return Session.equals(TAB_KEY, name);
    },
    activeTabClass: function() {
        return Session.get(TAB_KEY);
    },

    getMedia: function(id) {
        return Activities.find({
            userId: id
        }).count();
    },
    getWheelsCount: function(id) {
        return Wheels.find({
            userId: id
        }).count();
    },
    getWheels: function(id) {
        return Wheels.find({
            userId: id
        });
    },
    getFollowers: function(id) {
        return Followers.find({userId:id}).count()
    },
    getFollowing: function(id) {
        return 0;
    },
    getFollowStatus: function(id){
    	return Followers.find({followerId: Meteor.userId(), userId: id }).fetch();
    }
});

Template.garage.events({

    'click .tab-item': function(event){
        Session.set(TAB_KEY, $(event.target).text() );
    },

    'click .js-show-customs': function(event) {
        event.stopPropagation();
        Template.garage.setTab('custom')
    },

    'click .js-show-feed': function(event) {
        event.stopPropagation();
        Template.garage.setTab('feed')
    },

    'click .js-uncollapse': function() {
        Template.garage.setTab('garage')
    },
    'click .js-add-activity': function() {
        Overlay.open('activityOverlay', this);
    },
    'click .js-add-custom': function() {
        Overlay.open('wheelsOverlay', this);
    },
    'click #follow': function(event) {
    	Meteor.call('followUser', this._id);
        var notification = {
            recipientId : this._id,
            activityType: 'follower',
            objectId: Meteor.userId(),
            objectType: 'garage'
        }
        Meteor.call('createNotification', notification);
    },
    'click #unfollow': function(event) {
    	Meteor.call('unfollowUser', this._id);
        var notification = {
            recipientId : this._id,
            activityType: 'follower',
            objectId: Meteor.userId(),
            objectType: 'garage'
        }
        Meteor.call('removeNotification', notification);
    },
    'click #editAccount' : function(){
        Router.go('/edit-account/' + this._id)
    }
});
