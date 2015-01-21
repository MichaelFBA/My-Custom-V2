// If the auth overlay is on the screen but the user is logged in,
//   then we have come back from the loginWithTwitter flow,
//   and the user has successfully signed in.
//
// We have to use an autorun for this as callbacks get lost in the
//   redirect flow.
Template.authOverlay.created = function() {
    this.autorun(function() {
        if (Meteor.userId() && Overlay.template() === 'authOverlay')
            Overlay.close();
    });
}

Template.authOverlay.rendered = function () {
	$(document).foundation();
};

Template.authOverlay.events({
    'click .js-twitter-signin': function() {
        Meteor.loginWithTwitter({
            loginStyle: 'redirect'
        });
    },
    'click .js-facebook-signin': function() {
        Meteor.loginWithFacebook({
            loginStyle: 'redirect'
        });
    },
    'keyup #passwordSignIn': function(event) {
    	$('#signIn').removeClass('shake');
    },

    'click .closeModal':function(event){
    	event.preventDefault();
    	$('.modal-overlay').removeClass('is-active');
    },

    'click .openModal':function(event){
    	event.preventDefault();
    	$('.modal-overlay').addClass('is-active');
    },

    'click #signIn': function(event) {
    	event.preventDefault();
    	var user = $('#emailSignIn').val();
    	var password = $('#passwordSignIn').val();
    	Meteor.loginWithPassword(user, password, function(error){
    		if(error){
    			$('#signIn').addClass('shake');
    			console.log('no user')
    		}
    	})
    },

    'click #register': function(event) {
    	event.preventDefault();
    	var options = {
    		username : $('#nameRegister').val(),
    		email 	 : $('#emailRegister').val(),
    		password : $('#passwordRegister').val(),
    		profile  : {
    			name : $('#nameRegister').val()
    		}
		}
    	
    	Accounts.createUser(options, function(error){
    		if(error){
    			$('#register').addClass('shake');
    			console.log('no user')
    		}else{
                $('.modal-overlay').removeClass('is-active');
    			Router.go('/')
    		}
    	})
    }
});
