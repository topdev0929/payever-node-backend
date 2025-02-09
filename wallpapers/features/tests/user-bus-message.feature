@users
Feature: Users
  Background:
    Given I use DB fixture "business-wallpapers"
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

  Scenario: Merge Duplicate Users
    When I publish in RabbitMQ channel "async_events_wallpapers_micro" message with json:
      """
        {
          "name": "user.event.merge.duplicate",
          "payload": {
             "targetUser": {
                "_id": "593d0945-5539-4922-892e-b355d1f73c52",
                "businesses": [
                  "74b58859-3a62-4b63-83d6-cc492b2c8e29"
                ],
                "userAccount": {
                  "email": "johnTheMerchant2@example.com",
                  "firstName": "alpha"
                }
              },
              "usersToMerge": [
                {
                  "_id": "7d6d23b0-7ec3-4236-a29b-d59f147c6cc9",
                  "businesses": [
                    "84b58859-3a62-4b63-83d6-cc492b2c8e29"
                  ],
                  "userAccount": {
                    "email": "aldin.ugljanin@payever.org",
                    "firstName": "Aldin"
                  }
                },
                {
                  "_id": "778054ce-ac89-4a80-b503-de6f9aecd288",
                  "businesses": [
                    "74b58859-3a62-4b63-83d6-cc492b2c8e30"
                  ],
                  "userAccount": {
                    "email": "testmy12@gmail.com",
                    "firstName": "alpha"
                  }
                }
              ]
          }
        }
      """
    And I process messages from RabbitMQ "async_events_wallpapers_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "UserWallpapers" found by following JSON should exist:
    """
    {
      "user": "593d0945-5539-4922-892e-b355d1f73c52"
    }
    """

  