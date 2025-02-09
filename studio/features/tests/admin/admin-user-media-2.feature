Feature: User media features
  Background:
    Given I use DB fixture "user.media"
    Given I use DB fixture "business"
    Given I use DB fixture "user.album"
    Given I remember as "businessId" following value:
      """
      "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "userMediaId" following value:
      """
      "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I remember as "userMediaId2" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """
    Given I remember as "albumId1Lvl0" following value:
      """
      "0ebb5ea6-61de-46f7-833f-599018b7861f"
      """

  Scenario: Delete many user media
    When I send a POST request to "/api/admin/user-medias/delete-many" with json:
      """
      {
        "ids": [
          "{{userMediaId}}",
          "{{userMediaId2}}"
        ]
      }
      """
    Then print last response
    Then the response status code should be 200
    And model "UserMedia" with id "{{userMediaId}}" should not exist
    And model "UserMedia" with id "{{userMediaId2}}" should not exist
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "studio.event.business-media.deleted",
          "payload": {
            "id": "{{userMediaId}}",
            "business": {
              "id": "{{businessId}}"
            }
          }
        },
        {
          "name": "studio.event.business-media.deleted",
          "payload": {
            "id": "{{userMediaId2}}",
            "business": {
              "id": "{{businessId}}"
            }
          }
        }
      ]
      """

  Scenario: Add album to many user media
    When I send a POST request to "/api/admin/user-medias/add/album/{{albumId1Lvl0}}/business/{{businessId}}" with json:
      """
      {
        "ids": [
          "{{userMediaId}}",
          "{{userMediaId2}}"
        ]
      }
      """
    Then print last response
    Then the response status code should be 200
    Then I look for model "UserMedia" by following JSON and remember as "savedMedia":
      """
      {
        "_id": "{{userMediaId}}"
      }
      """
    And stored value "savedMedia" should contain json:
      """
      {
        "album": "{{albumId1Lvl0}}"
      }
      """
    Then I look for model "UserMedia" by following JSON and remember as "savedMedia2":
      """
      {
        "_id": "{{userMediaId2}}"
      }
      """
    And stored value "savedMedia2" should contain json:
      """
      {
        "album": "{{albumId1Lvl0}}"
      }
      """

  Scenario: remove album from many user media
    When I send a POST request to "/api/admin/user-medias/remove/album" with json:
      """
      {
        "ids": [
          "{{userMediaId}}",
          "{{userMediaId2}}"
        ]
      }
      """
    Then print last response
    Then the response status code should be 200
    Then I look for model "UserMedia" by following JSON and remember as "savedMedia":
      """
      {
        "_id": "{{userMediaId}}"
      }
      """
    And stored value "savedMedia" should not contain json:
      """
      {
        "album": "{{albumId1Lvl0}}"
      }
      """
    Then I look for model "UserMedia" by following JSON and remember as "savedMedia2":
      """
      {
        "_id": "{{userMediaId2}}"
      }
      """
    And stored value "savedMedia2" should not contain json:
      """
      {
        "album": "{{albumId1Lvl0}}"
      }
      """
