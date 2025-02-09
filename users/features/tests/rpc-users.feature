Feature: User RPC
  Scenario: Register user via RPC
    And I mock RPC request "auth.rpc.user.registered" to "auth.rpc.user.registered" with:
      """
      {
        "requestPayload": "*",
        "responsePayload": "*"
      }
      """
    When I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "auth.rpc.user.registered",
        "payload": {
          "userToken": {
            "id": "test",
            "firstName": "test",
            "lastName": "test",
            "email": "test@gmail.com"
          },
          "userInfo": {
            "language": "de"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_users_micro" channel
    Then I look for model "User" by following JSON and remember as "savedUser":
      """
      {
        "userAccount.email": "test@gmail.com"
      }
      """
    And stored value "savedUser" should contain json:
      """
      {
        "_id": "test",
        "userAccount": {
          "firstName": "test",
          "lastName": "test",
          "email": "test@gmail.com",
          "hasUnfinishedBusinessRegistration": false
        }
      }
      """