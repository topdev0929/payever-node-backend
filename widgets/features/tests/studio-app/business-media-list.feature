Feature: Business media get list
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "businessMediaId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "test@payever.de",
        "roles": [
          {
            "name": "merchant",
            "permissions": [{"businessId": "{{businessId}}", "acls": []}]
          }
        ]
      }
      """

  Scenario: Get list of business media
    Given I use DB fixture "studio-app/business-media-list"
    When I send a GET request to "/studio-app/business/{{businessId}}/last"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      [
        {
          "_id": "*",
          "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          "mediaType": "image",
          "name": "*",
          "url": "*",
          "__v": 0
        }
      ]
      """
