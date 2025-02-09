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

  Scenario: Delete album
    Given I use DB fixture "graphql/album/album"
    When I send a GraphQL query to "/album":
      """
      mutation {
        deleteAlbum(
          albumId: "{{albumId}}"
          businessId: "{{businessId}}"
        )
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "deleteAlbum": true
        }
      }
      """
    And model "Album" with id "{{albumId}}" should not exist

  Scenario: Delete album for builder
    Given I use DB fixture "graphql/album/album"
    When I send a GraphQL query to "/album":
      """
      mutation {
        deleteAlbumForBuilder(
          businessId: "{{businessId}}",
          filter: "{ \"albumId\": \"{{albumId}}\"}"
        )
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "deleteAlbumForBuilder": true
        }
      }
      """
    And model "Album" with id "{{albumId}}" should not exist
