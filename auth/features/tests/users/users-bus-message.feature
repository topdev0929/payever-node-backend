@users
Feature: Users
  Background:
    Given I use DB fixture "users"
    Given I use DB fixture "business"
    And I remember as "BUSINESS_2_ID" following value:
      """
      "532d6fba-6fb6-447d-b703-bf42e4361c1b"
      """
    And I remember as "MERCHANT_USER_ID" following value:
      """
      "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
      """
    And I authenticate as a user with the following data:
    """
    {
      "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "email": "merchant@example.com",
      "roles": [
      {
        "name": "user",
        "permissions": []
      },
      {
        "name": "merchant",
        "permissions": [{"businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac", "acls": []}]
      }]
    }
    """

  Scenario: Remove users and realted resources, if not provided in the event
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.fix.difference",
        "payload": {
          "users": [
            "cc3bec59-6f88-4d48-91af-0f391bbb8ce2",
            "8b5fb669-8fa0-8c83-a8dd-8fa8d45d2098"
          ]
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "User" with id "25ce50e7-1a76-47eb-a97f-9f2807a67979" should not exist
    Then model "User" with id "9d02442c-f504-4e1f-aea1-179084510248" should not exist
    Then model "User" found by following JSON should exist:
    """
    {
      "_id": "cc3bec59-6f88-4d48-91af-0f391bbb8ce2"
    }
    """
    Then model "User" found by following JSON should exist:
    """
    {
      "_id": "8b5fb669-8fa0-8c83-a8dd-8fa8d45d2098"
    }
    """
    Then model "Employee" found by following JSON should not exist:
    """
    {
      "userId": "9d02442c-f504-4e1f-aea1-179084510248"
    }
    """
    And model "Permission" found by following JSON should not exist:
    """
    {
      "userId": "9d02442c-f504-4e1f-aea1-179084510248"
    }
    """
    And model "Business" found by following JSON should not exist:
    """
    {
      "owner": "9d02442c-f504-4e1f-aea1-179084510248"
    }
    """




    