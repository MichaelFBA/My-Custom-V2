var TWEETING_KEY = 'shareOverlayTweeting';
var FACEBOOK_KEY = 'shareOverlayFacebook';

Template.activityOverlay.created = function() {
    Session.set(TWEETING_KEY, _.has(Meteor.user().services, 'twitter'));
    Session.set(FACEBOOK_KEY, _.has(Meteor.user().services, 'facebook'));

    Meteor.subscribe('wheels', Meteor.userId(), 1000);

    // 1. Initialization
    var instance = this;
    // initialize the reactive variables
    instance.whichTemplate = new ReactiveVar("addCustom");
    instance.phoneImage = new ReactiveVar(false);
    instance.phoneVideo = new ReactiveVar(false);
    instance.geolocation = new ReactiveVar(null);

    Session.set("video", null);

    //Geo Location
    function onSuccess(data) {
        console.log(data)
        instance.geolocation.set(data);
    }
    function onError(error) {
        console.log('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    document.addEventListener("deviceready", onDeviceReady, false);

}

Template.activityOverlay.helpers({
    hasCaptured: function() {
        return Template.instance().phoneImage.get() || Template.instance().phoneVideo.get()
    },

    attachedImage: function() {
        return Template.instance().phoneImage.get()
    },

    attachedVideo: function() {
        function result(data){
            console.log(data)
            Session.set("video", data.fullPath);
        }
        function fail(data){
            console.error(data)
        }
        window.resolveLocalFileSystemURL( Template.instance().phoneVideo.get()[0].localURL , result, fail);
        return Session.get("video");
    },

    getVideoSize: function() {
        return Template.instance().phoneVideo.get()[0].size;
    },

});

Template.activityOverlay.events({
    'change #makeChoice': function(event, instance) {
        instance.whichTemplate.set($(event.target).val());
    },

    'click .js-attach-video': function(event,instance) {
    	// capture callback
		var captureSuccess = function(mediaFiles) {
			instance.phoneVideo.set(mediaFiles);
		};

		// capture error callback
		var captureError = function(error) {
		    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
		};

		// start video capture
		navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1});
    },

    'click .js-attach-image': function(event, instance) {
        var options = {
            height: 1000,
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
    },
    'click .js-camera-roll': function(event, instance) {
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

    },

    'click .js-unattach-image': function(instance) {
        instance.phoneImage.set(null);
    },

    'change #type': function(event) {
        Session.set("Type", window[$(event.target).val()]);
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
        var b64Data;
        var video = instance.phoneVideo.get();

        var wheels = {}
        wheels.description = $(event.target).find('#description').val()
        wheels.tweet = tweet

        if( getHashTags(wheels.description).length >=1 ){
            wheels.tags = getHashTags(wheels.description);
        }

        if( geo ){
            wheels.location = geo;
        }

        if(video){
            Meteor.call('getYoutubeToken', function(error, result) {
                if (error) {
                    console.error(error)
                }
                postVideo(result, video[0].fullPath, wheels)
            });

        }else{
        //Image
            var b64Data = instance.phoneImage.get().replace(/^data.*base64,/, '')
            //Upload to AmazonS3
            var uploader = new Slingshot.Upload("myFileUploads");
            var contentType = 'image/jpeg';
            var blob = b64toBlob(b64Data, contentType);

            Blaze.renderWithData(Template.progressBar, uploader, $('#progress').get(0))

            uploader.send(blob, function(error, downloadUrl) {

            wheels.image = downloadUrl;

            if (tweet) {
                wheels.b64Data = b64Data;
            } else if (facebook) {
                postToFB(wheels.description, wheels.image)
            }
            createWheels(wheels);

            }); //Close upload
        }



    },

    'click #connectFB': function(event) {
        if (!_.has(Meteor.user().services, "facebook")) {
            Meteor.connectWith("facebook", {
                requestPermissions: ['publish_actions']
            });
        }
    },
    'click #connectTW': function(event) {
        if (!_.has(Meteor.user().services, "twitter")) {
            Meteor.connectWith("twitter");
        }
    }
});

function getHashTags(words){
    var tagslistarr = words.split(' ');
    var arr=[];
    $.each(tagslistarr,function(i,val){
        if(tagslistarr[i].indexOf('#') == 0){
          arr.push(tagslistarr[i]);
        }
    });
    return arr;
}

function createWheels(wheels) {


    Meteor.call('createWheels', wheels , function(error, result) {
        if (error) {
            alert(error.reason);
            $('#progress').remove()
        } else {
            sendNotifications(result)

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

function sendNotifications(wheelsId) {
    var followers = Followers.find({
        userId: Meteor.userId()
    }).fetch()

    _.each(followers, function(value, key, list) {

        var notification = {
            recipientId: value.followerId,
            activityType: 'wheels',
            objectId: wheelsId,
            objectType: 'wheels'
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

    var blob = new Blob(byteArrays, {
        type: contentType
    });
    return blob;
}

function postToFB(description, imageUrl) {
    FB.api('/me/feed', 'post', {
        message: description,
        picture: imageUrl,
        application: 1451011255133475
    }, function(response) {
        if (!response || response.error) {
            console.log('Error occured');
        } else {
            console.log('Post ID: ' + response.id);
        }
    });
}

function postVideo(accessToken, fileURI, wheelsObj) {
    var wheels = wheelsObj
    var metadata = {
        snippet: {
            title: "test",
            description: "test",
            tags: ["youtube-cors-upload"],
            categoryId: 21
        },
        status: {
            privacyStatus: "unlisted"
        }
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = 'test';
    options.mimeType = "video/mp4";
    options.chunkedMode = false;

    options.headers = {
        Authorization: "Bearer "+ accessToken,
        "Access-Control-Allow-Origin": "http://meteor.local"
    };

    var params = new Object();
    params.part = Object.keys(metadata).join(',')

    options.params = params;

    function win(r) {
    console.log(r.response)
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    wheels.video = JSON.parse(r.response);
    createWheels(wheels);
    }

    function fail(error) {
        console.log(error)
        // alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var ft = new FileTransfer();
    ft.upload(fileURI, "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet", win, fail, options, true);

    var progress = 0;
    Blaze.renderWithData(Template.progressBar, progress, $('#progress').get(0))

    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            // console.log(progressEvent)
          // loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        } else {
            console.log('something not loading')
          // loadingStatus.increment();
        }
        console.log(progressEvent.loaded / progressEvent.total);

        progress = progressEvent.loaded / progressEvent.total;

    };
}



