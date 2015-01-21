Template.wheels.helpers({
    relatedActivities: function() {
        return Activities.find({
            wheels: this._id
        }).fetch();
    },
    
    getUserImage: function(id) {
        return Meteor.users.findOne(id).profile.picture;
    },

    likeCount: function() {
        return Likes.find({
            activityId: this._id
        }).count();
    },

    isliked: function() {
        return Likes.find({
            activityId: this._id,
            likedById: Meteor.userId()
        }).fetch();
    },

    commentCount: function(id) {
        Meteor.subscribe('getComments', id, function(result) {
            console.log('got comments')
        });
        return Comments.find({
            discussion_id: this._id
        }).count();
    },

    hasCommented: function() {
        return Comments.find({
            discussion_id: this._id,
            userId: Meteor.userId()
        }).fetch();
    }
});


Template.wheels.events({

    'click #like': function(event) {
        event.preventDefault();
        Meteor.call('likeActivity', this._id);

        var notification = {
            recipientId: this.userId,
            activityType: 'like',
            objectId: this._id,
            objectType: 'custom'
        }
        Meteor.call('createNotification', notification);
    },

    'click #unlike': function(event) {
        Meteor.call('unlikeActivity', this._id);

        var notification = {
            recipientId: this.userId,
            activityType: 'like',
            objectId: this._id,
            objectType: 'custom'
        }
        Meteor.call('removeNotification', notification);
    }

});
