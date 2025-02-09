Feature: Post
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "folderId" following value:
      """
      "folder-id-1"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
  Scenario: folders name cannot be an empty string
    Given I use DB fixture "post"
    When I send a POST request to "/folders/business/{{businessId}}" with json:
      """
      {
        "name": "    ",
        "position": 1
      }
      """
    Then print last response
    And the response status code should be 400
  Scenario: folders name cannot be an empty string on update
    Given I use DB fixture "folder"
    When I send a PATCH request to "/folders/business/{{businessId}}/folder/{{folderId}}" with json:
      """
      {
        "name": "    ",
        "position": 1
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "errors": [
          "name should not be empty"
        ],
        "message": "Validation failed",
        "statusCode": 400
      }
      """