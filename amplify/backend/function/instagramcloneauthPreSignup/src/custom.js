/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  // Confirm the user
  event.response.autoConfirmUser = true

  // Set the email as verified if it is in the request
  if (event.request.userAttributes.hasOwnProperty('email')) {
    event.response.autoVerifyEmail = true
  }

  // Return to Amazon Cognito
  return event
}
