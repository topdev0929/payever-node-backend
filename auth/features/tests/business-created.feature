Feature: Business changes
  Background: constants
    Given I load constants from "features/fixtures/const.ts"

  Scenario: Business created
    Given I use DB fixture "users"
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{BUSINESS_1_ID}}",
          "userAccountId": "{{MERCHANT_USER_ID}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then model "Permission" found by following JSON should exist:
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_1_ID}}"
      }
      """

    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{BUSINESS_1_ID}}",
          "userAccountId": "{{MERCHANT_USER_ID}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then model "User" with id "{{MERCHANT_USER_ID}}" should contain json:
      """
      {
        "roles": [{
          "name": "merchant",
          "permissions": [
            "*",
            "*"
            ]
        }]
      }
      """

  # temporary commented, should be investigated in separate ticket
  #Scenario: Reset business permissions
  #  Given I use DB fixture "users"
  #  When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
  #    """
  #    {
  #      "name": "users.event.business.created",
  #      "payload": {
  #        "_id": "{{BUSINESS_2_ID}}",
  #        "userAccountId": "{{MERCHANT_USER_ID}}"
  #      }
  #    }
  #    """
  #  And I process messages from RabbitMQ "async_events_auth_micro" channel
  #  Then model "User" with id "{{MERCHANT_USER_ID}}" should contain json:
  #    """
  #    {
  #      "roles": [{
  #        "name": "merchant",
  #        "permissions": [{
  #          "businessId": "{{BUSINESS_2_ID}}",
  #          "acls": []
  #        }]
  #      }]
  #    }
  #    """
  #  Then model "User" with id "{{MERCHANT_USER_ID}}" should not contain json:
  #    """
  #    {
  #      "roles": [{
  #        "name": "merchant",
  #        "permissions": [{
  #          "businessId": "{{BUSINESS_2_ID}}",
  #          "acls": [{
  #            "create": true,
  #            "microservice": "mail"
  #          }]
  #        }]
  #      }]
  #    }
  #    """
