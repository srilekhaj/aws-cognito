var AWS = require('aws-sdk');
var CognitoSDK = require('amazon-cognito-identity-js-node');
 
AWS.CognitoIdentityServiceProvider.AuthenticationDetails = CognitoSDK.AuthenticationDetails;
AWS.CognitoIdentityServiceProvider.CognitoUserPool = CognitoSDK.CognitoUserPool;
AWS.CognitoIdentityServiceProvider.CognitoUser = CognitoSDK.CognitoUser;


function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
  
       // Add the Google access token to the Amazon Cognito credentials login map.
       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-2_FtEiG9Lyv',
          Logins: {
             'accounts.google.com': authResult['id_token']
          }
       });
  
       // Obtain AWS credentials
       AWS.config.credentials.get(function(){
          // Access AWS resources here.
          if (err) {
            console.log("Error: "+err);
            return;
        }
        console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
    
        // Other service clients will automatically use the Cognito Credentials provider
        // configured in the JavaScript SDK.
        var cognitoSyncClient = new AWS.CognitoSync();
        cognitoSyncClient.listDatasets({
            IdentityId: AWS.config.credentials.identityId,
            IdentityPoolId: "us-east-2_FtEiG9Lyv"
        }, function(err, data) {
            if ( !err ) {
                console.log(JSON.stringify(data));
            }
        });
       });
    }
  }