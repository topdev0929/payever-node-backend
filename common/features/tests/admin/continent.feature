Feature: Admin endpoints for continents
  Background:
    Given I use DB fixture "continents"
    And I remember as "CONTINENT_ID" following value:
      """
      "continentCode"
      """
    And I remember as "NEW_CONTINENT_ID" following value:
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

  Scenario: Get one continent for admin
    When I send a GET request to "/api/admin/continent/{{CONTINENT_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "{{CONTINENT_ID}}",
      "name": "name"
    }
    """

  Scenario: Get one continent for admin without admin rights
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{ "name": "merchant" }]
    }
    """
    When I send a GET request to "/api/admin/continent/{{CONTINENT_ID}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "error": "Forbidden"
    }
    """

  Scenario: List of continents for admin
    When I send a GET request to "/api/admin/continent/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "continents": [
        {
          "_id": "{{CONTINENT_ID}}",
          "name": "name"
        }
      ]
    }
    """

  Scenario: List of continents for admin with filters
    When I send a GET request to "/api/admin/continent/list?limit=10&page=1&projection=name"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "continents": [
        {
          "name": "name"
        }
      ]
    }
    """

  Scenario: Create a continent for admin
    When I send a POST request to "/api/admin/continent" with json:
    """
    {
      "id": "{{NEW_CONTINENT_ID}}",
      "name": "wow yay"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "{{NEW_CONTINENT_ID}}",
      "name": "wow yay"
    }
    """

  Scenario: Update a continent for admin
    When I send a PATCH request to "/api/admin/continent/{{CONTINENT_ID}}" with json:
    """
    {
      "name": "brand new name"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "name": "brand new name"
    }
    """

  Scenario: Delete a continent for admin
    When I send a GET request to "/api/admin/continent/{{CONTINENT_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/continent/{{CONTINENT_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "name": "name"
    }
    """
    When I send a GET request to "/api/admin/continent/{{CONTINENT_ID}}"
    Then the response status code should be 404
