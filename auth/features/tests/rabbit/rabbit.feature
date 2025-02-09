Feature: Rabbit events handling
  Scenario: handle "user account updated" event
    Given I use DB fixture "users"
    And I remember as "merchantId" following value:
      """
      "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
      """

    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.user_account.updated",
        "payload": {
          "_id": "{{merchantId}}",
          "email": "arst@gmail.com",
          "firstName": "First Name",
          "lastName": "Last Name"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_auth_micro" channel

    And model "User" with id "{{merchantId}}" should contain json:
      """
      {
        "email": "arst@gmail.com",
        "firstName": "First Name",
        "lastName": "Last Name"
      }
      """

  Scenario: handle "user account updated" event
    Given I use DB fixture "users"
    And I remember as "merchantId" following value:
      """
      "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
      """

    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.user.removed",
        "payload": {
          "_id": "{{merchantId}}",
          "email": "arst@gmail.com"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_auth_micro" channel

    And model "User" with id "{{merchantId}}" should not exist
