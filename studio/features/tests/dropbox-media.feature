Feature: Subscription media features
  Background:
    Given I use DB fixture "dropbox.media"
    Given I remember as "subscriptionMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I remember as "attributeId" following value:
      """
        "64a19c1b-4ea0-4675-aafb-f50c2e3ab12d"
      """
    Given I remember as "attributeValue" following value:
      """
        "test1"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "admin",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

  Scenario: Get all dropbox pagination
    Given I get file "features/data/dropbox-media.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/dropbox?page=1&limit=2&asc=size"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get image dropbox pagination
    Given I get file "features/data/dropbox-image.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/dropbox/image?page=1&limit=2&asc=size"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get video dropbox pagination
    Given I get file "features/data/dropbox-video.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/dropbox/video?page=1&limit=3&asc=size"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """
  Scenario: Get failed dropbox pagination
    Given I get file "features/data/dropbox-failed.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/dropbox/failed?page=1&limit=2&asc=size"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get dropbox by id
    When I send a GET request to "/api/dropbox/57248822-6d67-4a83-97b6-ef5c9d97b6dd"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "downloaded": false,
        "_id": "57248822-6d67-4a83-97b6-ef5c9d97b6dd",
        "sourceId": "id:KBjBsL4dyDoAAAAAAAAiSw",
        "createdAt": "2021-03-03T09:00:18.057Z",
        "lastModified": "2020-04-15T09:04:19.000Z",
        "name": "vid2.mp4",
        "path": "/storage server/payever media/vid2.mp4",
        "type": "video",
        "updatedAt": "2021-03-03T09:00:18.057Z",
        "__v": 0
      }
      """

  Scenario: Delete dropbox by id
    Given I get file "features/data/dropbox-media.response.json" content and remember as "response" with placeholders
    When I send a DELETE request to "/api/dropbox/57248822-6d67-4a83-97b6-ef5c9d97b6dd"
    Then print last response
    Then the response status code should be 200
    Then model "DropboxMedia" with id "57248822-6d67-4a83-97b6-ef5c9d97b6dd" should not exist

  Scenario: Mine dropbox
    When I send a GET request to "/api/dropbox/mining"
    Then the response status code should be 200

  Scenario: Download dropbox
    When I send a GET request to "/api/dropbox/download"
    Then the response status code should be 200

  Scenario: Download reset
    When I send a GET request to "/api/dropbox/reset"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "ok": 1
      }
      """

  Scenario: Mine dropbox
    When I send a GET request to "/api/dropbox/excel"
    Then the response status code should be 200

  Scenario: Mine dropbox
    When I send a GET request to "/api/dropbox/set/attribute"
    Then the response status code should be 200
