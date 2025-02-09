Feature: Categories GraphQL API. Create album
  Background:
    Given I remember as "newalbumName" following value:
      """
      "new album"
      """
    And I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "rootParentalbumId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

  Scenario: Create album
    When I send a GraphQL query to "/album":
      """
      mutation {
        createAlbum(
          businessId: "{{businessId}}",
          album: {
            name: "test-2-2",
            description: "test-2-2",
            parent: "ef843137-47a3-4cab-b1ec-23eee1c77dfa"
          }
        ) {
          id
          ancestors
          businessId
          description
          name
          parent
        }
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "createAlbum": {
            "id": "*",
            "ancestors": [],
            "businessId": "{{businessId}}",
            "description": "test-2-2",
            "name": "test-2-2",
            "parent": "ef843137-47a3-4cab-b1ec-23eee1c77dfa"
          }
        }
      }
      """

  Scenario: Create album
    When I send a GraphQL query to "/album":
      """
      mutation {
        createAlbumForBuilder(
          businessId: "{{businessId}}",
          filter: "{ \"name\": \"album for builder\", \"description\": \"album for builder\", \"parent\": \"ef843137-47a3-4cab-b1ec-23eee1c77dfa\" }"
        ) {
          id
          ancestors
          businessId
          description
          name
          parent
        }
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "createAlbumForBuilder": {
            "id": "*",
            "ancestors": [],
            "businessId": "{{businessId}}",
            "description": "album for builder",
            "name": "album for builder",
            "parent": "ef843137-47a3-4cab-b1ec-23eee1c77dfa"
          }
        }
      }
      """
