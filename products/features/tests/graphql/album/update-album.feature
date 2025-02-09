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
    And I remember as "albumId" following value:
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

  Scenario: Update album
    Given I use DB fixture "graphql/album/album"
    When I send a GraphQL query to "/album":
      """
      mutation {
        updateAlbum(
          albumId: "{{albumId}}",
          businessId: "{{businessId}}",
          album: {
            name: "test category",
            description: "test",
          }
        ) {
          id
          ancestors
          businessId
          description
          icon
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
          "updateAlbum": {
            "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "ancestors": [],
            "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "description": "test",
            "icon": "function String() { [native code] }",
            "name": "test category"
          }
        }
      }
      """

  Scenario: Update album for builder
    Given I use DB fixture "graphql/album/album"
    When I send a GraphQL query to "/album":
      """
      mutation {
        updateAlbumForBuilder(
          businessId: "{{businessId}}",
          filter: "{ \"albumId\": \"{{albumId}}\", \"description\": \"album for builder updated\" }"
        ) {
          id
          ancestors
          businessId
          description
          icon
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
          "updateAlbumForBuilder": {
            "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "ancestors": [],
            "businessId": "{{businessId}}",
            "description": "album for builder updated",
            "icon": "function String() { [native code] }",
            "name": "Album 1"
          }
        }
      }
      """
