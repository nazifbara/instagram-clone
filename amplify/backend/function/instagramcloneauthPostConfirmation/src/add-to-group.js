const aws = require('aws-sdk')

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
})

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
exports.handler = async (event) => {
  const addUserParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
    Username: event.userName,
  }

  await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise()

  return event
}
