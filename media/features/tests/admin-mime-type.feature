Feature: Admin mime-type
  Background:
    Given I use DB fixture "admin-mime-type"
    And I authenticate as a user with the following data:
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
    When I send a GET request to "/api/admin/mime-types"
    Then response status code should be 403

  Scenario: Get all mime-types
    When I send a GET request to "/api/admin/mime-types"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "key": "jpg",
            "name": "image/jpg",
            "groups": ["g1","g2"]
          },
          {
            "key": "png",
            "name": "image/png",
            "groups": ["g1","g2"]
          },
          {
            "key": "gif",
            "name": "image/gif",
            "groups": ["g3","g4"]
          },
          {
            "key": "mp4",
            "name": "video/mp4",
            "description": "description"
          }
        ],
        "total": 4
      }
      """

  Scenario: Get all mime-types with filter
    When I send a GET request to "/api/admin/mime-types?group=g1"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "key": "jpg",
            "name": "image/jpg",
            "groups": ["g1","g2"]
          },
          {
            "key": "png",
            "name": "image/png",
            "groups": ["g1","g2"]
          }
        ],
        "total": 2
      }
      """

  Scenario: Get mime-type by id
    When I send a GET request to "/api/admin/mime-types/mime-type-4"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "mime-type-4",
        "key": "mp4",
        "name": "video/mp4",
        "description": "description"
      }
      """

  Scenario: Get mime-type by key
    When I send a GET request to "/api/admin/mime-types/key/mp4"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "mime-type-4",
        "key": "mp4",
        "name": "video/mp4",
        "description": "description"
      }
      """

  Scenario: Create new mime-type
    When I send a POST request to "/api/admin/mime-types" with json:
      """
      {
        "key": "zip",
        "name": "application/zip",
        "description": "zip file",
        "groups": ["group1","group2"]
      }
      """
    Then print last response
    And I store a response as "response"
    And response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "key": "zip",
        "name": "application/zip",
        "description": "zip file",
        "groups": ["group1","group2"]
      }
      """
    When I send a GET request to "/api/admin/mime-types/{{response._id}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{response._id}}",
        "name": "application/zip",
        "description": "zip file",
        "groups": ["group1","group2"]
      }
      """

  Scenario: Update a mime-type
    When I send a PATCH request to "/api/admin/mime-types/mime-type-1" with json:
      """
      {
        "key": "jpg",
        "name": "name-2",
        "description":"description-2",
        "groups": ["g1","g2"]
      }
      """
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "key": "jpg",
        "name": "name-2",
        "description": "description-2",
        "groups": ["g1","g2"]
      }
      """
    When I send a GET request to "/api/admin/mime-types/key/jpg"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "mime-type-1",
        "key": "jpg",
        "name": "name-2",
        "description": "description-2",
        "groups": ["g1","g2"]
      }
      """

  Scenario: Delete mime-type
    When I send a DELETE request to "/api/admin/mime-types/mime-type-1"
    Then print last response
    And the response status code should be 200
    When I send a GET request to "/api/admin/mime-types/key/mime-type-1"
    Then print last response
    And the response status code should be 404
