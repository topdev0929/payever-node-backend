Feature: Handle multiple users with the same email
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "user"

  Scenario: Receive multiple users
    Given I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "user.event.merge.duplicate",
        "payload": {
        "usersToMerge":[
          {"_id":"{{ID_OF_USER_9}}"},
          {"_id":"{{ID_OF_USER_8}}"}
        ],
        "targetUser":{
          "userAccount":{
            "_id": "{{ID_OF_USER_10}}",
          "email": "uem1@example.com",
          "firstName": "Jake",
          "lastName": "Johns",
          "logo": "jake.png",
          "phone": "+84518478"
          }

        }
      }
      }
      """
    And print RabbitMQ message list
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ message list
    And model "ChatMember" with id "{{ID_OF_USER_9}}" should contain json:
      """
      {
        "userAccount": {
           "_id": "{{ID_OF_USER_10}}",
          "email": "uem1@example.com",
          "firstName": "Jake",
          "lastName": "Johns",
          "logo": "jake.png",
          "phone": "+84518478"
        }
      }
      """