@user-media-features
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
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """
    Given I remember as "albumId1Lvl0" following value:
      """
        "0ebb5ea6-61de-46f7-833f-599018b7861f"
      """

  Scenario: Add album to many user media different business
    When I send a POST request to "/api/{{businessId2}}/medias/add/album/{{albumId1Lvl0}}" with json:
      """
      {
        "ids": [
          "{{userMediaId}}",
          "{{userMediaId2}}"
        ]
      }
      """
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
      """
      {
        "error": "Forbidden",
        "statusCode": 403
      }
      """
