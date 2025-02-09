Feature: Run last messages syncing
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    
  Scenario: Run last messages syncing
    Given I use DB fixture "customer-chats"
    Given I use DB fixture "messages"
    Then model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should not contain json:
      """
      {
        "lastMessages": [{
          "_id": "{{ID_OF_CONTACT_MESSAGE_2}}"
        }]
      }
      """
    When I run command "last-messages:sync" with args:
      """
      "--chat={{ID_OF_CUSTOMER_CHAT}}"
      """
    Then model "AbstractMessaging" with id "{{ID_OF_CUSTOMER_CHAT}}" should contain json:
      """
      {
        "lastMessages": [
          {
            "_id": "{{ID_OF_CONTACT_MESSAGE_2}}"
          },
          {
            "_id": "{{ID_OF_USER_MESSAGE}}"
          }
        ]
      }
      """
