Feature: Admin file Controller
  Background:
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
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "fileId" following value:
      """
      "b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1"
      """
    Given I remember as "appId" following value:
      """
      "a1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1"
      """
  
  Scenario: Only admin role has access to admin endpoint
    Given I authenticate as a user with the following data:
      """
      {
        "roles": [
          {
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/api/admin/files"
    Then response status code should be 403

  Scenario: File uploading
    Given I use DB fixture "exist-business"
    Given I attach the file "sample.pdf" to "file"
    When I send a POST request to "/api/admin/files/business/{{businessId}}/container/message/application/{{appId}}" with form data:
    |||

    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "blobName":"*"
    }
    """

  Scenario: Get media items of application
    Given I use DB fixture "exist-business"
    Given I use DB fixture "media-item"
    When I send a GET request to "/api/admin/files?applicationIds={{appId}}&container=message"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "_id": "10ff2c21-fb3c-420a-a331-e5d51e511fa1",
            "applicationId": "a1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1",
            "container": "message",
            "name": "mediaItemName"
          }
        ]
      }
      """
    And the response should not contain json:
      """
      {
        "documents": [
          {
            "_id": "10ff2c21-fb3c-420a-a331-e5d51e511fa2"
          }
        ]
      }
      """

  Scenario: Get media items of application with date filter
    Given I use DB fixture "exist-business"
    Given I use DB fixture "media-item"
    When I send a GET request to "/api/admin/files?createdAtGte=2000-01-01"
    And the response should contain json:
      """
      {
        "total": 3
      }
      """
    When I send a GET request to "/api/admin/files?createdAtGte=2900-01-01"
    And the response should contain json:
      """
      {
        "total": 0
      }
      """
    When I send a GET request to "/api/admin/files?createdAtGte=2900-01-01&createdAtLte=2900-01-01"
    And the response should contain json:
      """
      {
        "total": 0
      }
      """

    When I send a GET request to "/api/admin/files?updatedAtGte=2000-01-01"
    And the response should contain json:
      """
      {
        "total": 3
      }
      """
    When I send a GET request to "/api/admin/files?updatedAtGte=2900-01-01"
    And the response should contain json:
      """
      {
        "total": 0
      }
      """
    When I send a GET request to "/api/admin/files?updatedAtGte=2900-01-01&updatedAtLte=2900-01-01"
    And the response should contain json:
      """
      {
        "total": 0
      }
      """

  Scenario: Get media by id
    Given I use DB fixture "exist-business"
    Given I use DB fixture "media-item"
    When I send a GET request to "/api/admin/files/10ff2c21-fb3c-420a-a331-e5d51e511fa1"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "10ff2c21-fb3c-420a-a331-e5d51e511fa1",
        "applicationId": "a1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1",
        "container": "message",
        "name": "mediaItemName"
      }
      """

  Scenario: Get media container and name
    Given I use DB fixture "exist-business"
    Given I use DB fixture "media-item"
    When I send a GET request to "/api/admin/files/container/message/name/mediaItemName"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "10ff2c21-fb3c-420a-a331-e5d51e511fa1",
        "applicationId": "a1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1",
        "container": "message",
        "name": "mediaItemName"
      }
      """

  Scenario: Delete media items of application
    Given I use DB fixture "exist-business"
    Given I use DB fixture "media-item"
    When I send a DELETE request to "/api/admin/files/business/{{businessId}}/container/message/application/{{appId}}"
    Then print last response
    And the response status code should be 200
