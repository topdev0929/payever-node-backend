Feature: Admin endpoints for languages
  Background:
    Given I use DB fixture "languages"
    And I remember as "LANGUAGE_ID" following value:
      """
      "language"
      """
    And I remember as "NEW_LANGUAGE_ID" following value:
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

  Scenario: Get one language for admin
    When I send a GET request to "/api/admin/language/{{LANGUAGE_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "{{LANGUAGE_ID}}",
      "englishName": "en",
      "name": "English"
    }
    """

  Scenario: Get one language for admin without admin rights
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{ "name": "merchant" }]
    }
    """
    When I send a GET request to "/api/admin/language/{{LANGUAGE_ID}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "error": "Forbidden"
    }
    """

  Scenario: List of languages for admin
    When I send a GET request to "/api/admin/language/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "languages": [
        {
          "_id": "{{LANGUAGE_ID}}",
          "englishName": "en",
          "name": "English"
        }
      ]
    }
    """

  Scenario: List of languages for admin with filters
    When I send a GET request to "/api/admin/language/list?limit=10&page=1&projection=name"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "languages": [
        {
          "name": "English"
        }
      ]
    }
    """
  And the response should not contain json:
    """
    {
      "page": 1,
      "total": 1,
      "languages": [
        {
          "englishName": "en"
        }
      ]
    }
    """

  Scenario: Create a language for admin
    When I send a POST request to "/api/admin/language" with json:
    """
    {
      "id": "{{NEW_LANGUAGE_ID}}",
      "englishName": "new arwa",
      "name": "new Arwa"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "{{NEW_LANGUAGE_ID}}",
      "englishName": "new arwa",
      "name": "new Arwa"
    }
    """

  Scenario: Update a language for admin
    When I send a PATCH request to "/api/admin/language/{{LANGUAGE_ID}}" with json:
    """
    {
      "englishName": "UPDATED arwa",
      "name": "UPDATED Arwa"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "englishName": "UPDATED arwa",
      "name": "UPDATED Arwa"
    }
    """

  Scenario: Delete a language for admin
    When I send a GET request to "/api/admin/language/{{LANGUAGE_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/language/{{LANGUAGE_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "englishName": "en",
      "name": "English"
    }
    """
    When I send a GET request to "/api/admin/language/{{LANGUAGE_ID}}"
    Then the response status code should be 404
