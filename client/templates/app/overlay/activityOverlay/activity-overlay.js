var TWEETING_KEY = 'shareOverlayTweeting';
var FACEBOOK_KEY = 'shareOverlayFacebook';

Template.activityOverlay.created = function() {
  Session.set(TWEETING_KEY, _.has( Meteor.user().services, 'twitter' ) );
  Session.set(FACEBOOK_KEY, _.has( Meteor.user().services ,'facebook' ) );

  Meteor.subscribe('wheels', Meteor.userId(), 1000);

  // 1. Initialization
  var instance = this;
  // initialize the reactive variables
  instance.whichTemplate = new ReactiveVar("addNewMedia");
  instance.phoneImage = new ReactiveVar();
  instance.geolocation = new ReactiveVar();

  //Geo Location
  var success = function(data){
  	instance.geolocation.set(data);
  }
  navigator.geolocation.getCurrentPosition(success);
}

Template.activityOverlay.helpers({
  attachedImage: function() {
  	return Template.instance().phoneImage.get()
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

  'click .js-attach-image': function(event,instance) {
  		var options = {
  			height:1000,
  			width: 1000,
		 	quality: 80
		}
		MeteorCamera.getPicture(options, function(err, data) {
		  if (err) {
		    console.log('error', err);
		  }
		  if (data) {
		    instance.phoneImage.set(data);
		  }
		});

		// navigator.camera.getPicture(onSuccess, onFail, {
		// 	quality: 80,
		// 	destinationType: Camera.DestinationType.DATA_URL,
		// 	correctOrientation:true
		// 	});

		// function onSuccess(data) {
		// 	instance.phoneImage.set(data);
		// }

		// function onFail(message) {
		// 	alert('Failed because: ' + message);
		// }
  },
  'click .js-camera-roll':function(event,instance){
  		var options = {
  			height: 1000,
			width: 1000,
			quality: 80,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY
		}
		MeteorCamera.getPicture(options, function(err, data) {
		  if (err) {
		    console.log('error', err);
		  }
		  if (data) {
		    instance.phoneImage.set(data);
		  }
		});

		// navigator.camera.getPicture(onSuccess, onFail, {
		// 	quality: 80,
		// 	destinationType: Camera.DestinationType.DATA_URL,
		// 	sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
		// 	correctOrientation:true
		// 	});

		// function onSuccess(data) {
		// 	instance.phoneImage.set(data);
		// }

		// function onFail(message) {
		// 	alert('Failed because: ' + message);
		// }
  },

	'click .js-unattach-image': function(instance) {
		instance.phoneImage.set(null);
	},

	'change #type': function(event) {
		Session.set("Type", window[$(event.target).val()] );
	},

	'change [name=twitter]': function(event) {
		Session.set(TWEETING_KEY, $(event.target).is(':checked'));
	},

	'change [name=facebook]': function(event) {
		Session.set(FACEBOOK_KEY, $(event.target).is(':checked'));
	},

	'submit': function(event, instance) {
		event.preventDefault();
		var whichTemplate = instance.whichTemplate.get();
		var geo = instance.geolocation.get();
		var self = this;
		var tweet = Session.get(TWEETING_KEY);
		var facebook = Session.get(FACEBOOK_KEY);

		//Upload to AmazonS3
		var uploader = new Slingshot.Upload("myFileUploads");
		var contentType = 'image/jpeg';
		var b64Data = instance.phoneImage.get().replace(/^data.*base64,/, '');
		var blob = b64toBlob(b64Data, contentType);

		Blaze.renderWithData(Template.progressBar, uploader, $('#progress').get(0))
		uploader.send(blob, function (error, downloadUrl) {
			switch(whichTemplate) {
			    case "addNewMedia":
					var description = $(event.target).find('#description').val()
					if(!tweet){
						b64Data = '';
					}else if(facebook){
						postToFB(description, downloadUrl)
					}
					addActivity(description,downloadUrl,"",tweet, b64Data);
			        break;
			    case "addCustom":
			        var type = $(event.target).find('#type').val()
					var make = $(event.target).find('#make').val()
					var model = $(event.target).find('#model').val()
					var year = $(event.target).find('#year').val()
					var description = $(event.target).find('#description').val()
					if(!tweet){
						b64Data = '';
					}else if(facebook){
						postToFB(description, downloadUrl)
					}
					addWheels(type,make,model,year,description,downloadUrl,tweet, b64Data,geo)
			        break;
			    case "addToExisting":
			    	var description = $(event.target).find('#description').val()
			    	var relatedId = $(event.target).find('#related').val()
			    	if(!tweet){
						b64Data = '';
					}else if(facebook){
						postToFB(description, downloadUrl)
					}
					addActivity(description,downloadUrl,relatedId,tweet, b64Data,geo);
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

function addWheels(type,make,model,year,description,downloadUrl,tweet, b64DataForTwitter,geo){


		Meteor.call('createWheels', {
		  type: type,
		  make: make,
		  model: model,
		  year: year,
		  description: description,
		  image: downloadUrl,
		  b64Data: b64DataForTwitter
		}, tweet, geo, function(error, result) {
		  if (error) {
			alert(error.reason);
			$('#progress').remove()
		  } else {
		  	notifyActivity(result)

		  	Router.go('/')

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

function addActivity(description,downloadUrl,wheelsId,tweet, b64DataForTwitter,geo){

		Meteor.call('createActivity', {
			wheels: wheelsId,
			description: description,
			image: downloadUrl,
			b64Data: b64DataForTwitter
		}, tweet, geo, function(error, result) {
			if (error) {
				alert(error.reason);
				$('#progress').remove()
		} else {
			//Create DB Notifications
			notifyActivity(result);

			Router.go('/')

			//Notify user
			Template.appBody.addNotification({
				action: 'View',
				title: 'New activity added.',
				callback: function() {
					Router.go('/');
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

function postToFB(description, imageUrl){
  FB.api('/me/feed', 'post', { message: description, picture: imageUrl, application: 1451011255133475 }, function(response) {
    if (!response || response.error) {
      console.log('Error occured');
    } else {
      console.log('Post ID: ' + response.id);
    }
  });
}


