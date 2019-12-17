const{ google} = require('googleapis');
const OAuth2Client =google.auth.OAuth2;

const googleConfig = {
  clientId: '172401726886-0pk8rna94t1vju46h31ird1a9k55ue12.apps.googleusercontent.com',
  clientSecret: '1d9n6XVJtehu_cPYkZmcTvUs', 
  redirect: 'http://localhost:8080/google/redirect' 
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  return new OAuth2Client(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/gmail.readonly'
  ];

  function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', 
      scope: defaultScope
    });
  }

  exports.urlGoogle = () => {
    const auth = createConnection(); 
    const url = getConnectionUrl(auth);
    return url;
  }


  /**
 * Helper function to get the library with access to the google plus api.
 */
function getGooglePlusApi(auth) {
    return google.gmail({ version: 'v1', auth });
  }
  
  /**
   * Extract the email and id of the google account from the "code" parameter.
   */
  exports.getGoogleAccountFromCode = async (code) => {
    console.log("calling getGoogleccountFroCode ");
    
        
    const auth = createConnection();
    // get the auth "tokens" from the request
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    
    // add the tokens to the google api so we have access to the account
    
    auth.setCredentials(tokens);
    
    // connect to google plus - need this to get the user's email
    const plus = getGooglePlusApi(auth);
    const me = await plus.users.getProfile({ userId: 'me' });
    console.log("me ->" +  JSON.stringify(me));
    // get the google id and email
    const userGoogleEmail = me.data.emailAddress;
  
    console.log("usergoogleemail-> " + userGoogleEmail);
    // return so we can login or sign up the user
    return {
      email: userGoogleEmail,
      tokens: tokens, // you can save these to the user if you ever want to get their details without making them log in again
    };
  }