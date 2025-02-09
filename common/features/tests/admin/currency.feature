Feature: Admin endpoints for currencies
  Background:
    Given I use DB fixture "currencies"
    And I remember as "CURRENCY_ID" following value:
      """
      "currencyCode"
      """
    And I remember as "NEW_CURRENCY_ID" following value:
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

  Scenario: Get one currency for admin
    When I send a GET request to "/api/admin/currency/{{CURRENCY_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "{{CURRENCY_ID}}",
      "name": "currency",
      "symbol": "currenciesMap",
      "rate": 123.45
    }
    """

  Scenario: Get one currency for admin without admin rights
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{ "name": "merchant" }]
    }
    """
    When I send a GET request to "/api/admin/currency/{{CURRENCY_ID}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "error": "Forbidden"
    }
    """

  Scenario: List of currencies for admin
    When I send a GET request to "/api/admin/currency/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "currencies": [
        {
          "_id": "{{CURRENCY_ID}}",
          "name": "currency",
          "symbol": "currenciesMap",
          "rate": 123.45
        }
      ]
    }
    """

  Scenario: List of currencies for admin with filters
    When I send a GET request to "/api/admin/currency/list?limit=10&page=1&projection=name"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "currencies": [
        {
          "name": "currency"
        }
      ]
    }
    """
    And the response should not contain json:
    """
    {
      "currencies": [
        {
          "symbol": "currenciesMap",
          "rate": 123.45
        }
      ]
    }
    """

  Scenario: Create a currency for admin
    When I send a POST request to "/api/admin/currency" with json:
    """
    {
      "id": "{{NEW_CURRENCY_ID}}",
      "name": "wow yay",
      "symbol": "NEW_currenciesMap",
      "rate": 12.34
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "{{NEW_CURRENCY_ID}}",
      "name": "wow yay",
      "symbol": "NEW_currenciesMap",
      "rate": 12.34
    }
    """

  Scenario: Update a currency for admin
    When I send a PATCH request to "/api/admin/currency/{{CURRENCY_ID}}" with json:
    """
    {
      "name": "brand new name",
      "symbol": "UPDATED_currenciesMap"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "name": "brand new name",
      "symbol": "UPDATED_currenciesMap"
    }
    """

  Scenario: Delete a currency for admin
    When I send a GET request to "/api/admin/currency/{{CURRENCY_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/currency/{{CURRENCY_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "name": "currency",
      "symbol": "currenciesMap"
    }
    """
    When I send a GET request to "/api/admin/currency/{{CURRENCY_ID}}"
    Then the response status code should be 404
