var feedSubscription;

//Push notification startup
//When messages opens the app:
Push.addListener('startup', function(notification) {

    if( notification.payload.pushType == 'like'){ Router.go('activity', { _id: notification.payload.itemId });  }
    if( notification.payload.pushType == 'comment'){ Router.go('comments', { _id: notification.payload.itemId }); }
    if( notification.payload.pushType == 'activity'){ Router.go('activity', { _id: notification.payload.itemId }); }
    if( notification.payload.pushType == 'follower'){ Router.go('garage', { _id: notification.payload.itemId }); }
    if( notification.payload.pushType == 'custom'){ Router.go('wheels', { _id: notification.payload.itemId }); }

});


// Handle for launch screen possibly dismissed from app-body.js
dataReadyHold = null;

// Global subscriptions
if (Meteor.isClient) {
    Meteor.subscribe('commonUserData')
    Meteor.subscribe('news')
}

if (Meteor.isClient) {
    // Keep showing the launch screen on mobile devices until we have loaded
    // the app's data
    dataReadyHold = LaunchScreen.hold();
    dataReadyHold.release();
}

Router.configure({
    layoutTemplate: 'appBody',
    notFoundTemplate: 'notFound'
});

Router.map(function() {
    //Cordova
    // if (Meteor.isCordova) {
        this.route('home', {
            path: '/' });
    // }else{
    //     this.route('website-home', {
    //         path: '/',
    //         layoutTemplate: null
    //     });
    // }
    //App
    
    this.route('about');
    this.route('search');
    this.route('settings');
    this.route('garage', {
        path: '/garage/:_id'
    });
    this.route('editAccount', {
        path: '/edit-account/:_id'
    });
    this.route('activity', {
        path: '/activity/:_id'
    });
    this.route('wheels', {
        path: '/wheels/:_id'
    });

    //Web
    this.route('terms', {
        path: '/terms',
        layoutTemplate: 'terms'
    });
    this.route('privacy', {
        path: '/privacy',
        layoutTemplate: 'privacy'
    });
    this.route('comments', {
        path: '/comments/:_id'
    });
    this.route('notifications');

    
    // this.route('admin', {
    //     layoutTemplate: null
    // });
});

// Router.onBeforeAction('dataNotFound', {
//     only: 'recipe'
// });


HomeController = RouteController.extend({
    onBeforeAction: function() {
        if (Meteor.user()){
            dataReadyHold.release();
        }else{
            Overlay.open('authOverlay');
        }
        this.next()
 },
    data: function() {
        return Activities.find().fetch();
    }
});

GarageController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('getGarage', this.params._id);
        this.next()
    },
    data: function() {
        if (Meteor.user())
            return Meteor.users.findOne({_id: this.params._id});
    }
});

ActivityController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('getActivity', this.params._id);
        this.next()
    },
    data: function() {
        return Activities.findOne(this.params._id);
    }
});
WheelsController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('getWheels', this.params._id);
        this.next()
    },
    data: function() {
        return Wheels.findOne();
    }
});
EditAccountController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('getUser', this.params._id);
        this.next()
    },
    data: function() {
        return Meteor.users.findOne();
    }
});

CommentsController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('getComments', this.params._id);
        this.next()
    },
    data: function() {
        return Comments.find().fetch();
    }
});

SearchController = RouteController.extend({
    onBeforeAction: function() {
        Meteor.subscribe('blankSearch');
        this.next()
    },
    data: function() {
        return Wheels.find().fetch();
    }
});

// AdminController = RouteController.extend({
//     onBeforeAction: function() {
//         Meteor.subscribe('news');
//         this.next()
//     }
// });



