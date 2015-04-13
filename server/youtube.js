
//Google O-Auth signing to pass back to client
Meteor.methods({
    getYoutubeToken: function() {


        var now = moment();
        var result;
        if (now.diff(Meteor.settings.youtube.expiration, 'minutes') >= 50) {
            console.log('Getting new access token...')

            var options = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                content: "client_secret=" + Meteor.settings.youtube.client_secret + "&grant_type=refresh_token&refresh_token=" + Meteor.settings.youtube.refresh_token + "&client_id=" + Meteor.settings.youtube.client_id
            }

            try {
                result = HTTP.call("POST", 'https://www.googleapis.com/oauth2/v3/token', options);
                Meteor.settings.youtube.access_token = result.data.access_token;
                Meteor.settings.youtube.expiration = moment();

                return Meteor.settings.youtube.access_token;
            } catch (e) {
                // Got a network error, time-out or HTTP error in the 400 or 500 range.
                return false;
            }


        } else {
            console.log('Returning access token...')
            return Meteor.settings.youtube.access_token;
        }

    }
});
