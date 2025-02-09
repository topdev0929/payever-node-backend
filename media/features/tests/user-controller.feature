Feature: Storage Controller
  Background:
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{USER_1_ID}}",
        "email": "user-1@payever.de",
        "roles": [
          {
            "name": "user"
          }
        ]
      }
      """

  Scenario: Image uploading works fine
    Given I attach the file "ussr.png" to "file"
    When I send a POST request to "/api/image/user/{{USER_1_ID}}/shop" with form data:
      |  |  |
    Then print last response
    And I store a response as "response"
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "blobName": "*",
        "brightnessGradation": "*",
        "thumbnail": "*"
      }
      """
    Then I look for model "MediaItem" by following JSON and remember as "mediaItem":
    """
      {
        "name": "{{response.blobName}}",
        "container": "shop"
      }
    """
    Then I look for model "MediaItemRelation" by following JSON and remember as "mediaItemRelation":
    """
      {
        "mediaItem":"{{mediaItem._id}}"
      }
    """
    And stored value "mediaItemRelation" should contain json:
      """
      {
        "mediaItem":"{{mediaItem._id}}",
        "entityId": "{{USER_1_ID}}",
        "entityType": "UserModel"
      }
      """

  Scenario: Try to upload a file - filetype could not be detected
    Given I attach the file "wrong.txt" to "file"
    When I send a POST request to "/api/image/user/{{USER_1_ID}}/builder" with form data:
      |  |  |
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "message": "Document type is not correct"
      }
      """

  Scenario: Delete media by container/blob
    Given model "MediaItem" found by following JSON should exist:
    """
    {
      "_id":"{{USER_1_MEDIA_ITEM_1_ID}}"
    }
    """
    Given model "MediaItemRelation" found by following JSON should exist:
    """
    {
      "_id":"media-item-relation"
    }
    """
    When I send a DELETE request to "/api/image/user/{{USER_1_ID}}/shop/mediaItemName" 
    Then print last response
    And the response status code should be 204
    Then model "MediaItem" with id "{{USER_1_MEDIA_ITEM_1_ID}}" should not exist
    Then model "MediaItemRelation" with id "media-item-relation" should not exist
