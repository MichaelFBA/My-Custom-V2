var TWEETING_KEY = 'shareOverlayTweeting';
var FACEBOOK_KEY = 'shareOverlayFacebook';
var IMAGE_KEY = 'shareOverlayAttachedImage';

Template.activityOverlay.created = function() {
  Session.set(TWEETING_KEY, false);
  Session.set(IMAGE_KEY, null);

  Meteor.subscribe('wheels', Meteor.userId(), 1000);

  // 1. Initialization
  var instance = this;
  // initialize the reactive variables
  instance.whichTemplate = new ReactiveVar("addNewMedia");
}

Template.activityOverlay.helpers({
  attachedImage: function() {
  	return Session.get(IMAGE_KEY);
  },
  
  avatar: function() {
	return Meteor.user().services.twitter.profile_image_url_https;
  },
  
  tweeting: function() {
	return Session.get(TWEETING_KEY);
  },

  getWheels: function(){
	return Wheels.find().fetch();
  },
  customChoice:function(){
	if(  Template.instance().whichTemplate.get() ){
		return Template[  Template.instance().whichTemplate.get() ];
	}else{
		return null;
	}
  }
});

Template.activityOverlay.events({
	'change #makeChoice':function(event, instance){
		instance.whichTemplate.set( $(event.target).val() );
	},

  'click .js-attach-image': function() {
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 80,
			destinationType: Camera.DestinationType.DATA_URL,
			correctOrientation:true
			});

		function onSuccess(data) {
			Session.set(IMAGE_KEY, data);
		}

		function onFail(message) {
			alert('Failed because: ' + message);
		}
  },
  'click .js-camera-roll':function(event){
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 80,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			correctOrientation:true
			});

		function onSuccess(data) {
			Session.set(IMAGE_KEY, data);
		}

		function onFail(message) {
			alert('Failed because: ' + message);
		}
  },

	'click .js-unattach-image': function() {
		Session.set(IMAGE_KEY, null);
	},

	'change #type': function(event) {
		Session.set("Type", window[$(event.target).val()] );
	},
  
	'change [name=tweeting]': function(event) {
		Session.set(TWEETING_KEY, $(event.target).is(':checked'));
	},

	'change [name=facebook]': function(event) {
		Session.set(FACEBOOK_KEY, $(event.target).is(':checked'));
	},

	'submit': function(event, instance) {
		event.preventDefault();
		var whichTemplate = instance.whichTemplate.get();
		var self = this;
		var tweet = Session.get(TWEETING_KEY);
		var facebook = Session.get(FACEBOOK_KEY);

		//Upload to AmazonS3
		var uploader = new Slingshot.Upload("myFileUploads");
		var contentType = 'image/jpeg';
		var b64Data = Session.get(IMAGE_KEY);
		var blob = b64toBlob(b64Data, contentType);
		
		Blaze.renderWithData(Template.progressBar, uploader, $('#progress').get(0)) 
		uploader.send(blob, function (error, downloadUrl) {

			switch(whichTemplate) {
			    case "addNewMedia":
					var description = $(event.target).find('#description').val()
					addActivity(description,downloadUrl,"",tweet,facebook);
			        break;
			    case "addCustom":
			        var type = $(event.target).find('#type').val()
					var make = $(event.target).find('#make').val()
					var model = $(event.target).find('#model').val()
					var year = $(event.target).find('#year').val()
					var description = $(event.target).find('#description').val()
					addWheels(type,make,model,year,description,downloadUrl,tweet,facebook)
			        break;
			    case "addToExisting":
			    	var description = $(event.target).find('#description').val()
			    	var relatedId = $(event.target).find('#related').val()
					addActivity(description,downloadUrl,relatedId,tweet,facebook);
			        break;
			}

		}); //Close upload
  },

   'click #connectFB': function(event){
		if (!_.has( Meteor.user().services, "facebook") ) {
			Meteor.connectWith("facebook", {requestPermissions: ['publish_actions']});
		}
   },
   'click #connectTW': function(event){
		if (!_.has( Meteor.user().services, "twitter") ) {
			Meteor.connectWith("twitter");
		}
   }
});

function addWheels(type,make,model,year,description,downloadUrl,tweet,facebook){
	Meteor.call('createWheels', {
	  type: type,
	  make: make,
	  model: model,
	  year: year,
	  description: description,
	  image: downloadUrl
	}, tweet, Geolocation.currentLocation(), function(error, result) {
	  if (error) {
		console.log(error);
	  } else {
	  	notifyActivity(result)

		Template.appBody.addNotification({
		  action: 'View',
		  title: 'Your custom was added.',
		  callback: function() {
			Template.garage.setTab('custom')
		  }
		});
		Overlay.close();
	  }
	});
}

function addActivity(description,downloadUrl,wheelsId,tweet,facebook){
	Meteor.call('createActivity', {
		wheels: wheelsId,
		description: description,
		image: downloadUrl
	}, tweet, Geolocation.currentLocation(), function(error, result) {
		if (error) {
			alert(error.reason);
	} else {
		//Create DB Notifications
		notifyActivity(result);
		//Notify user
		Template.appBody.addNotification({
			action: 'View',
			title: 'New activity added.',
			callback: function() {
				Router.go('home');
			}
		});
		Overlay.close();
	 }
	});//Close activity
}


function notifyActivity(activityId){
	var followers = Followers.find({userId:Meteor.userId()}).fetch()

	_.each(followers, function(value, key, list){
	
		var notification = {
			recipientId : value.followerId,
			activityType: 'activity',
			objectId: activityId,
			objectType: 'activity'
		}
		Meteor.call('createNotification', notification);
	
	});
}

function b64toBlob(b64Data, contentType, sliceSize) {
	contentType = contentType || '';
	sliceSize = sliceSize || 512;

	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, {type: contentType});
	return blob;
}
