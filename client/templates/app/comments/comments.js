Template.comments.events({
    'click #submitComment': function(event) {
        var self = this;
        var text = $('#comment').val();
        var discussionId = Router.current().params['_id'];
        Meteor.call('createComment', {
            discussion_id: discussionId,
            text: text,
        }, function(error, result) {
            if (error) {
                alert(error.reason);
            } else {
            	Router.go('/')
            }
        })

        //Make unique array so not duplicate users
        var uniqueList = _.uniq(self, function(item, key, a) {
            return item.userId;
        });
        //Add notification to all recipients who commented
        _.each(uniqueList, function(value, key, list){

            var notification = {
                recipientId : value.userId,
                activityType: 'comment',
                objectId: discussionId,
                objectType: 'wheels'
            }
            Meteor.call('createNotification', notification);

        });

    }
});
