Feature: Admin endpoints for taxes
  Background:
    Given I use DB fixture "taxes"
    And I remember as "TAX_ID" following value:
      """
      "f1e18c0c-5b36-4287-9c62-aeb28e174071"
      """
    And I remember as "NEW_TAX_ID" following value:
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

  Scenario: Get one tax for admin
    When I send a GET request to "/api/admin/tax/{{TAX_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "{{TAX_ID}}",
      "country": "UK",
      "description": "some description",
      "rate": 12.34
    }
    """

  Scenario: Get one tax for admin without admin rights
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{ "name": "merchant" }]
    }
    """
    When I send a GET request to "/api/admin/tax/{{TAX_ID}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "error": "Forbidden"
    }
    """

  Scenario: List of taxes for admin
    When I send a GET request to "/api/admin/tax/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "taxes": [
        {
          "_id": "{{TAX_ID}}",
          "country": "UK",
          "description": "some description",
          "rate": 12.34
        }
      ]
    }
    """

  Scenario: List of taxes for admin with filters
    When I send a GET request to "/api/admin/tax/list?limit=10&page=1&projection=country"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "taxes": [
        {
          "country": "UK"
        }
      ]
    }
    """
    And the response should not contain json:
    """
    {
      "taxes": [
        {
          "description": "some description",
          "rate": 12.34
        }
      ]
    }
    """

  Scenario: Create a tax for admin
    When I send a POST request to "/api/admin/tax" with json:
    """
    {
      "id": "{{NEW_TAX_ID}}",
      "country": "NEW UK",
      "description": "NEW some description",
      "rate": 44.55
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "{{NEW_TAX_ID}}",
      "country": "NEW UK",
      "description": "NEW some description",
      "rate": 44.55
    }
    """

  Scenario: Update a tax for admin
    When I send a PATCH request to "/api/admin/tax/{{TAX_ID}}" with json:
    """
    {
      "country": "UPDATED UK"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "country": "UPDATED UK",
      "description": "some description",
      "rate": 12.34
    }
    """

  Scenario: Delete a tax for admin
    When I send a GET request to "/api/admin/tax/{{TAX_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/tax/{{TAX_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "country": "UK",
      "description": "some description",
      "rate": 12.34
    }
    """
    When I send a GET request to "/api/admin/tax/{{TAX_ID}}"
    Then the response status code should be 404
