Template.wheelCard.helpers({

    likeCount: function() {
        return Likes.find({
            wheelsId: this._id
        }).count();
    },

    isliked: function() {
        return Likes.find({
            wheelsId: this._id,
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


Template.wheelCard.events({

    'click #like': function(event) {
        event.preventDefault();
        Meteor.call('likeActivity', this._id);

        var notification = {
            recipientId: this.userId,
            activityType: 'like',
            objectId: this._id,
            objectType: 'wheels'
        }
        Meteor.call('createNotification', notification);
    },

    'click #unlike': function(event) {
        Meteor.call('unlikeActivity', this._id);

        var notification = {
            recipientId: this.userId,
            activityType: 'like',
            objectId: this._id,
            objectType: 'wheels'
        }
        Meteor.call('removeNotification', notification);
    }

});
