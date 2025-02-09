Feature: Admin endpoints for common storage
  Background:
    Given I use DB fixture "common-storage"
    And I remember as "COMMON_STORAGE_ID" following value:
      """
      "SOME_NAME"
      """
    And I remember as "NEW_COMMON_STORAGE_ID" following value:
      """
      "anotherOne"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{ "name": "admin" }]
    }
    """

  Scenario: Get one piece of common storage for admin
    When I send a GET request to "/api/admin/common-storage/{{COMMON_STORAGE_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "{{COMMON_STORAGE_ID}}",
      "type": "some type",
      "value": "some value"
    }
    """

  Scenario: Get one piece of common storage for admin without admin rights
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{ "name": "merchant" }]
    }
    """
    When I send a GET request to "/api/admin/common-storage/{{COMMON_STORAGE_ID}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "error": "Forbidden"
    }
    """

  Scenario: List of data in common storage for admin
    When I send a GET request to "/api/admin/common-storage/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "commonStorage": [
        {
          "_id": "{{COMMON_STORAGE_ID}}",
          "type": "some type",
          "value": "some value"
        }
      ]
    }
    """

  Scenario: List of data in common storage for admin with filters
    When I send a GET request to "/api/admin/common-storage/list?limit=10&page=1&projection=value"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "commonStorage": [
        {
          "value": "some value"
        }
      ]
    }
    """
    And the response should not contain json:
    """
    {
      "commonStorage": [
        {
          "type": "some type"
        }
      ]
    }
    """

  Scenario: Create a piece of common storage for admin
    When I send a POST request to "/api/admin/common-storage" with json:
    """
    {
      "id": "{{NEW_COMMON_STORAGE_ID}}",
      "type": "NEW type",
      "value": "NEW value"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "{{NEW_COMMON_STORAGE_ID}}",
      "type": "NEW type",
      "value": "NEW value"
    }
    """

  Scenario: Update a piece of common storage for admin
    When I send a PATCH request to "/api/admin/common-storage/{{COMMON_STORAGE_ID}}" with json:
    """
    {
      "value": "UPDATED value"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "type": "some type",
      "value": "UPDATED value"
    }
    """

  Scenario: Delete a piece of common storage for admin
    When I send a GET request to "/api/admin/common-storage/{{COMMON_STORAGE_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/common-storage/{{COMMON_STORAGE_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "type": "some type",
      "value": "some value"
    }
    """
    When I send a GET request to "/api/admin/common-storage/{{COMMON_STORAGE_ID}}"
    Then the response status code should be 404
