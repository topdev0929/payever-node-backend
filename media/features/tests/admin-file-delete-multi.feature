Feature: Admin delete multiple files
  Background:
    Given I use DB fixture "admin-files-delete-multi"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """
    Given I remember as "businessId" following value:
      """
      "business-1"
      """
    Given I remember as "appId" following value:
      """
      "app-1"
      """

  Scenario: Delete multiple files
    When I send a GET request to "/api/admin/files/container/message/name/media-1"
    And the response status code should be 200
    And response should contain json:
      """
      {
        "_id": "media-item-1",
        "container": "message",
        "name": "media-1"
      }
      """
    And model "MediaItem" with id "media-item-1" should contain json:
      """
      {
        "name":"media-1",
        "container": "message"
      }
      """
    And model "MediaItem" with id "media-item-2" should contain json:
      """
      {
        "name":"media-2",
        "container": "message"
      }
      """
    And model "Business" with id "business-1" should not contain json:
      """
      {
        "_id": "business-1",
        "mediaItems": [ ]
      }
      """
    When I send a DELETE request to "/api/admin/files?container=message"
    Then print last response
    And the response status code should be 200

    And model "MediaItem" with id "media-item-1" should not exist
    And model "MediaItem" with id "media-item-2" should not exist
    And model "MediaItem" with id "media-item-3" should contain json:
      """
      {
        "name":"media-3",
        "container": "products"
      }
      """

    When I send a GET request to "/api/admin/files/container/message/name/media-1"
    Then print last response
    And the response status code should be 404

    When I send a GET request to "/api/admin/files/container/message/name/media-2"
    And the response status code should be 404

    And model "Business" with id "business-1" should not contain json:
      """
      {
        "mediaItems": [
          {
            "container": "c1",
            "name": "n1"
          }
        ]
      }
      """

  Scenario: Delete multiple files for selecte business
    When I send a DELETE request to "/api/admin/files?container=message&media=media-1&businessIds=business-1"
    Then print last response
    And the response status code should be 200

    When I send a GET request to "/api/admin/files/container/message/name/media-1"
    Then print last response
    And the response status code should be 404

    And model "MediaItem" with id "media-item-1" should not exist
    And model "MediaItem" with id "media-item-2" should not exist
    And model "MediaItem" with id "media-item-3" should contain json:
      """
      {
        "name":"media-3",
        "container": "products"
      }
      """

    And model "MediaItemRelation" found by following JSON should not exist:
      """
      {
        "mediaItem": "media-item-1",
        "entityId": "business-1"
      }
      """

    And model "MediaItemRelation" found by following JSON should not exist:
      """
      {
        "mediaItem": "media-item-2",
        "entityId": "business-1"
      }
      """

    And model "MediaItemRelation" found by following JSON should not exist:
      """
      {
        "mediaItem": "media-item-1",
        "entityId": "business-2"
      }
      """

    And model "MediaItemRelation" found by following JSON should not exist:
      """
      {
        "mediaItem": "media-item-2",
        "entityId": "business-2"
      }
      """

  Scenario: Delete multiple files by create date
    When I send a DELETE request to "/api/admin/files?createdAtGte=2000-01-01"
    Then print last response
    And the response status code should be 200

    When I send a GET request to "/api/admin/files/container/message/name/media-1"
    Then print last response
    And the response status code should be 404
