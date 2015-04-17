Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function (userId, doc, fields, modifier) {
    return fields == 'isRead';
  },
  remove: function(){
    return true;
  }
});

Meteor.methods({
  markAllAsRead:function(){
    var id = Notifications.update({recipientId: this.userId}, {$set:{ isRead : true } },{multi: true});
    return id;
  },
  createNotification: function(notification) {
    check(Meteor.userId(), String);
    check(notification, {
      recipientId: String,
      activityType: String,
      objectId: String,
      objectType: String
    });

    notification.isRead = false;
    notification.senderId = Meteor.userId();
    notification.senderAvatar = Meteor.user().profile.picture;
    notification.senderName = Meteor.user().profile.name;
    notification.date = new Date;

    var id = Notifications.insert(notification);
    //Create Push Notification
    pushNotification(notification.senderId, notification.recipientId, notification.activityType, notification.objectId );
    return id;
  },

  removeNotification: function(notification){
    check(notification, {
      recipientId: String,
      activityType: String,
      objectId: String,
      objectType: String
    });
    Notifications.remove(notification);
  }

});

function pushNotification(senderId, recipientId, activityType, objectId){
  var pushAllowed = Meteor.users.findOne({_id: recipientId});
  if(pushAllowed && pushAllowed.profile.notifications){
    var text = '';
    var sender = Meteor.users.findOne({_id: senderId});
    text += sender.profile.name;

    if( activityType == 'like'){ text += ' liked your photo' }
    if( activityType == 'comment'){ text += ' commented on your photo' }
    if( activityType == 'activity'){ text += ' added a new photo' }
    if( activityType == 'follower'){ text += ' is now following you'; }
    if( activityType == 'custom'){ text += ' added a new custom' }

    Push.send({
        from: 'push',
        title: "My Custom",
        text: text,
        badge: 1,
        query: {
          userId: recipientId
        },
        payload: { pushType: activityType, itemId: objectId}
    });
  }
}

// _id
// recipientId
// senderId
// activityType ('like','comment' 'follower', 'activity', 'custom')
// objectId (to provide a direct id to the object of the notification in HTML)
// objectType ('activity', 'wheels', 'comments','garage')
// date
// isRead
