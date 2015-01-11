Accounts.onCreateUser(function(options, user) {
  if (options.profile)
    user.profile = options.profile;
    user.profile.notifications = true;

	if(user.services.facebook) {
        options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=square&height=300&width=300";
        user.profile = options.profile;
        user.profile.name = user.services.facebook.name;
   }
   if (user.services.twitter) {
        options.profile.picture = user.services.twitter.profile_image_url_https
        user.profile = options.profile;
    }

  // If this is the first user going into the database, make them an admin
  if (Meteor.users.find().count() === 0)
    user.admin = true;

  return user;
});


// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      html: html
    });
  }
});

var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width"/> </head> <body style="width: 100% !important; min-width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; text-align: left; line-height: 19px; font-size: 14px; margin: 0; padding: 0;"><style type="text/css">a:hover{color: #FFCD03 !important;}a:active{color: #FFCD03 !important;}a:visited{color: #FFCD03 !important;}h1 a:active{color: #2ba6cb !important;}h2 a:active{color: #2ba6cb !important;}h3 a:active{color: #2ba6cb !important;}h4 a:active{color: #2ba6cb !important;}h5 a:active{color: #2ba6cb !important;}h6 a:active{color: #2ba6cb !important;}h1 a:visited{color: #2ba6cb !important;}h2 a:visited{color: #2ba6cb !important;}h3 a:visited{color: #2ba6cb !important;}h4 a:visited{color: #2ba6cb !important;}h5 a:visited{color: #2ba6cb !important;}h6 a:visited{color: #2ba6cb !important;}table.button:hover td{background: #2795b6 !important;}table.button:visited td{background: #2795b6 !important;}table.button:active td{background: #2795b6 !important;}table.button:hover td a{color: #fff !important;}table.button:visited td a{color: #fff !important;}table.button:active td a{color: #fff !important;}table.button:hover td{background: #2795b6 !important;}table.tiny-button:hover td{background: #2795b6 !important;}table.small-button:hover td{background: #2795b6 !important;}table.medium-button:hover td{background: #2795b6 !important;}table.large-button:hover td{background: #2795b6 !important;}table.button:hover td a{color: #ffffff !important;}table.button:active td a{color: #ffffff !important;}table.button td a:visited{color: #ffffff !important;}table.tiny-button:hover td a{color: #ffffff !important;}table.tiny-button:active td a{color: #ffffff !important;}table.tiny-button td a:visited{color: #ffffff !important;}table.small-button:hover td a{color: #ffffff !important;}table.small-button:active td a{color: #ffffff !important;}table.small-button td a:visited{color: #ffffff !important;}table.medium-button:hover td a{color: #ffffff !important;}table.medium-button:active td a{color: #ffffff !important;}table.medium-button td a:visited{color: #ffffff !important;}table.large-button:hover td a{color: #ffffff !important;}table.large-button:active td a{color: #ffffff !important;}table.large-button td a:visited{color: #ffffff !important;}table.secondary:hover td{background: #d0d0d0 !important; color: #555;}table.secondary:hover td a{color: #555 !important;}table.secondary td a:visited{color: #555 !important;}table.secondary:active td a{color: #555 !important;}table.success:hover td{background: #457a1a !important;}table.alert:hover td{background: #970b0e !important;}table.facebook:hover td{background: #2d4473 !important;}table.twitter:hover td{background: #0087bb !important;}table.google-plus:hover td{background: #CC0000 !important;}@media only screen and (max-width: 600px){table[class="body"] img{width: auto !important; height: auto !important;}table[class="body"] center{min-width: 0 !important;}table[class="body"] .container{width: 95% !important;}table[class="body"] .row{width: 100% !important; display: block !important;}table[class="body"] .wrapper{display: block !important; padding-right: 0 !important;}table[class="body"] .columns{table-layout: fixed !important; float: none !important; width: 100% !important; padding-right: 0px !important; padding-left: 0px !important; display: block !important;}table[class="body"] .column{table-layout: fixed !important; float: none !important; width: 100% !important; padding-right: 0px !important; padding-left: 0px !important; display: block !important;}table[class="body"] .wrapper.first .columns{display: table !important;}table[class="body"] .wrapper.first .column{display: table !important;}table[class="body"] table.columns td{width: 100% !important;}table[class="body"] table.column td{width: 100% !important;}table[class="body"] .columns td.one{width: 8.333333% !important;}table[class="body"] .column td.one{width: 8.333333% !important;}table[class="body"] .columns td.two{width: 16.666666% !important;}table[class="body"] .column td.two{width: 16.666666% !important;}table[class="body"] .columns td.three{width: 25% !important;}table[class="body"] .column td.three{width: 25% !important;}table[class="body"] .columns td.four{width: 33.333333% !important;}table[class="body"] .column td.four{width: 33.333333% !important;}table[class="body"] .columns td.five{width: 41.666666% !important;}table[class="body"] .column td.five{width: 41.666666% !important;}table[class="body"] .columns td.six{width: 50% !important;}table[class="body"] .column td.six{width: 50% !important;}table[class="body"] .columns td.seven{width: 58.333333% !important;}table[class="body"] .column td.seven{width: 58.333333% !important;}table[class="body"] .columns td.eight{width: 66.666666% !important;}table[class="body"] .column td.eight{width: 66.666666% !important;}table[class="body"] .columns td.nine{width: 75% !important;}table[class="body"] .column td.nine{width: 75% !important;}table[class="body"] .columns td.ten{width: 83.333333% !important;}table[class="body"] .column td.ten{width: 83.333333% !important;}table[class="body"] .columns td.eleven{width: 91.666666% !important;}table[class="body"] .column td.eleven{width: 91.666666% !important;}table[class="body"] .columns td.twelve{width: 100% !important;}table[class="body"] .column td.twelve{width: 100% !important;}table[class="body"] td.offset-by-one{padding-left: 0 !important;}table[class="body"] td.offset-by-two{padding-left: 0 !important;}table[class="body"] td.offset-by-three{padding-left: 0 !important;}table[class="body"] td.offset-by-four{padding-left: 0 !important;}table[class="body"] td.offset-by-five{padding-left: 0 !important;}table[class="body"] td.offset-by-six{padding-left: 0 !important;}table[class="body"] td.offset-by-seven{padding-left: 0 !important;}table[class="body"] td.offset-by-eight{padding-left: 0 !important;}table[class="body"] td.offset-by-nine{padding-left: 0 !important;}table[class="body"] td.offset-by-ten{padding-left: 0 !important;}table[class="body"] td.offset-by-eleven{padding-left: 0 !important;}table[class="body"] table.columns td.expander{width: 1px !important;}table[class="body"] .right-text-pad{padding-left: 10px !important;}table[class="body"] .text-pad-right{padding-left: 10px !important;}table[class="body"] .left-text-pad{padding-right: 10px !important;}table[class="body"] .text-pad-left{padding-right: 10px !important;}table[class="body"] .hide-for-small{display: none !important;}table[class="body"] .show-for-desktop{display: none !important;}table[class="body"] .show-for-small{display: inherit !important;}table[class="body"] .hide-for-desktop{display: inherit !important;}table[class="body"] .right-text-pad{padding-left: 10px !important;}table[class="body"] .left-text-pad{padding-right: 10px !important;}}</style> <table class="body" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; height: 100%; width: 100%; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="center" align="center" valign="top" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: center; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0;"> <center style="width: 100%; min-width: 580px;"> <table class="row header" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 100%; position: relative; background: #FFCD03; padding: 0px;" bgcolor="#FFCD03"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="center" align="center" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: center; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0;" valign="top"> <center style="width: 100%; min-width: 580px;"> <table class="container" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: inherit; width: 580px; margin: 0 auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="wrapper last" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; position: relative; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 10px 0px 0px;" align="left" valign="top"> <table class="twelve columns" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 580px; margin: 0 auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="center" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: center; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0px 0px 10px;" align="center" valign="top"> <center style="width: 100%; min-width: 580px;"> <img class="center" src="http://my-custom.com/img/web/man.png" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; width: auto; max-width: 100%; float: none; clear: both; display: block; margin: 0 auto;" align="none"/></center> </td><td class="expander" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; visibility: hidden; width: 0px; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0;" align="left" valign="top"></td></tr></table></td></tr></table></center> </td></tr></table><table class="container" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: inherit; width: 580px; margin: 0 auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0;" align="left" valign="top"> <table class="row" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 100%; position: relative; display: block; padding: 0px;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="wrapper last" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; position: relative; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 10px 0px 0px;" align="left" valign="top"> <table class="twelve columns" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 580px; margin: 0 auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0px 0px 10px;" align="left" valign="top"> <h1 style="color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; text-align: left; line-height: 1.3; word-break: normal; font-size: 40px; margin: 0; padding: 0;" align="left">Welcome to My Custom</h1> <p class="lead" style="color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; text-align: left; line-height: 21px; font-size: 18px; margin: 0 0 10px; padding: 0;" align="left">My name is Shannon and I am the founder of My Custom. I wanted to send a personal thank you for signing up to My Custom.</p><p style="color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; text-align: left; line-height: 19px; font-size: 14px; margin: 0 0 10px; padding: 0;" align="left">Just so you know we are currently testing the mobile apps with a small bunch of beta users so it\'s bug free on launch. We\'re hoping to be releasing the app in the next month or so but if you have any sugguestions we would love to get your feedback.</p><p style="color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; text-align: left; line-height: 19px; font-size: 14px; margin: 0 0 10px; padding: 0;" align="left">We have big plans for the app, but we want to engage with the community to understand exactly what you want out of it.</p><p style="color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; text-align: left; line-height: 19px; font-size: 14px; margin: 0 0 10px; padding: 0;" align="left">Thanks for being one of the first to sign up for My Custom, we wont forget it.</p></td><td class="expander" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; visibility: hidden; width: 0px; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0;" align="left" valign="top"></td></tr></table></td></tr></table><table class="row footer" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 100%; position: relative; display: block; padding: 0px;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="wrapper" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; position: relative; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; border-top-width: 1px; border-top-color: #ebebeb; border-top-style: solid; margin: 0; padding: 10px 20px 0px 0px;" align="left" valign="top"> <table class="six columns" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 280px; margin: 0 auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="left-text-pad" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0px 0px 10px 10px;" align="left" valign="top"> <h5 style="color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; text-align: left; line-height: 1.3; word-break: normal; font-size: 24px; margin: 0; padding: 0 0 10px;" align="left">Connect With Us:</h5> <table class="tiny-button facebook" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 100%; overflow: hidden; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: center; color: #ffffff; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; display: block; width: auto !important; background: #3b5998; margin: 0; padding: 5px 0 4px; border: 1px solid #2d4473;" align="center" bgcolor="#3b5998" valign="top"> <a href="https://www.facebook.com/pages/My-Custom/545041412244261?ref=ts&amp;fref=ts" style="color: #ffffff; text-decoration: none; font-weight: normal; font-family: Helvetica, Arial, sans-serif; font-size: 12px;">Facebook</a> </td></tr></table><!-- <br><table class="tiny-button twitter"> <tr> <td> <a href="#">Twitter</a> </td></tr></table> --></td><td class="expander" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; visibility: hidden; width: 0px; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0;" align="left" valign="top"></td></tr></table></td><td class="wrapper last" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; position: relative; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; border-top-width: 1px; border-top-color: #ebebeb; border-top-style: solid; margin: 0; padding: 10px 0px 0px;" align="left" valign="top"> <table class="six columns" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 280px; margin: 0 auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="last right-text-pad" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0px 0px 10px;" align="left" valign="top"> <h5 style="color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; text-align: left; line-height: 1.3; word-break: normal; font-size: 24px; margin: 0; padding: 0 0 10px;" align="left">Contact Info:</h5> <p style="color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; text-align: left; line-height: 19px; font-size: 14px; margin: 0 0 10px; padding: 0;" align="left">Email: <a href="mailto:info@my-custom.com" style="color: #FFCD03; text-decoration: none;">info@my-custom.com</a></p></td><td class="expander" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; visibility: hidden; width: 0px; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0;" align="left" valign="top"></td></tr></table></td></tr></table><table class="row" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 100%; position: relative; display: block; padding: 0px;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="wrapper last" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; position: relative; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 10px 0px 0px;" align="left" valign="top"> <table class="twelve columns" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 580px; margin: 0 auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td align="center" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0px 0px 10px;" valign="top"> <center style="width: 100%; min-width: 580px;"> <p style="text-align: center; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0 0 10px; padding: 0;" align="center"><a href="http://www.my-custom.com/terms" style="color: #FFCD03; text-decoration: none;">Terms</a> | <a href="http://www.my-custom.com/privacy" style="color: #FFCD03; text-decoration: none;">Privacy</a></p></center> </td><td class="expander" style="word-break: break-word; -webkit-hyphens: auto; -moz-hyphens: auto; hyphens: auto; border-collapse: collapse !important; vertical-align: top; text-align: left; visibility: hidden; width: 0px; color: #222222; font-family: \'Helvetica\', \'Arial\', sans-serif; font-weight: normal; line-height: 19px; font-size: 14px; margin: 0; padding: 0;" align="left" valign="top"></td></tr></table></td></tr></table></td></tr></table></center> </td></tr></table></body></html>';