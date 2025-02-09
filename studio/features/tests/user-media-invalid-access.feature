Feature: User media features
  Background:
    Given I use DB fixture "user.media"
    Given I use DB fixture "business"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "businessId2" following value:
      """
        "3b1eb897-a009-4ff6-a850-3b1d3399f147"
      """
    Given I remember as "userMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "{{businessId2}}", "acls": []}
          ]
        }]
      }
      """

  Scenario: Invalid Request Create user media fail with different business id
    When I send a POST request to "/api/{{businessId}}/media" with json:
      """
      {
        "url":"https://example.com/someimage.png",
        "mediaType": "image",
        "name": "user image 1",
        "businessId": "{{businessId2}}"
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

  Scenario: Delete user media by id
    When I send a DELETE request to "/api/{{businessId2}}/media/{{userMediaId}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
      """
      {
        "statusCode": 403,
        "error": "Forbidden",
        "message": "Access Denied"
      }
      """
