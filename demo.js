var AWS = require('aws-sdk');
var CognitoSDK = require('amazon-cognito-identity-js-node');

const UserPoolId = "us-east-2_FtEiG9Lyv",
const ClientId = "3lq9h74arpno7mncb42u7ofsv3"

const poolData = {
    UserPoolId,
    ClientId
}

AWS.config.update({
    region: ''
})

async function registerUser (json){
    const {
        email,
    }
    return new Promise((resolve, reject) => {
        let attributeList = []
        attributeList.push(new AWS.CognitoIdentity.CognitoUserAttribute)
    })
}
exports.handler = async function(event, context, callback){
    const json = JSON.parse(event.body)
    const result = await registerUser(json)

    callback(null,{
        statusCode: result.statusCode,
        body : JSON.stringify(result)
    })
}



AWS.CognitoIdentityServiceProvider.AuthenticationDetails = CognitoSDK.AuthenticationDetails;
AWS.CognitoIdentityServiceProvider.CognitoUserPool = CognitoSDK.CognitoUserPool;
AWS.CognitoIdentityServiceProvider.CognitoUser = CognitoSDK.CognitoUser;


cmd.get('aws cognito-idp admin-create-user --user-pool-id <user pool id> --username <username> --user-attributes Name=email,Value=<emailid@domain.com>  Name=phone_number,Value=<9876543210> Name=email_verified,Value=True Name=phone_number_verified,Value=True --temporary-password <password> --desired-delivery-mediums "EMAIL" "SMS"');







const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();
​
// userId - our user record index key
// email - the new user's email address
// password - the new user's password
function createCognitoUser(userId, email, password) {
  let params = {
    UserPoolId: USER_POOL_ID, // From Cognito dashboard 'Pool Id'
    Username: userId,
    MessageAction: "SUPPRESS", // Do not send welcome email
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email
      },
      {
        // Don't verify email addresses
        Name: "email_verified",
        Value: "true"
      }
    ]
  };
​
  return cognito
    .adminCreateUser(params)
    .promise()
    .then(data => {
      // We created the user above, but the password is marked as temporary.
      // We need to set the password again. Initiate an auth challenge to get
      // started.
      let params = {
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        ClientId: USER_POOL_CLIENT_ID, // From Cognito dashboard, generated app client id
        UserPoolId: USER_POOL_ID,
        AuthParameters: {
          USERNAME: userId,
          PASSWORD: password
        }
      };
      return cognito.adminInitiateAuth(params).promise();
    })
    .then(data => {
      // We now have a proper challenge, set the password permanently.
      let challengeResponseData = {
        USERNAME: userId,
        NEW_PASSWORD: password
      };
​
      let params = {
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: USER_POOL_CLIENT_ID,
        UserPoolId: USER_POOL_ID,
        ChallengeResponses: challengeResponseData,
        Session: data.Session
      };
      return cognito.adminRespondToAuthChallenge(params).promise();
    })
    .catch(console.error);
}