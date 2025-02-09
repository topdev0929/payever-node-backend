Feature: Admin endpoints for legal-forms
  Background:
    Given I use DB fixture "legal-forms"
    And I remember as "LEGAL_FORM_ID" following value:
      """
      "legal-form-1g3g"
      """
    And I remember as "NEW_LEGAL_FORM_ID" following value:
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

  Scenario: Get one legal-form for admin
    When I send a GET request to "/api/admin/legal-form/{{LEGAL_FORM_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "{{LEGAL_FORM_ID}}",
      "abbreviation": "abbreviation",
      "country": "DE",
      "description": "description"
    }
    """

  Scenario: Get one legal-form for admin without admin rights
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{ "name": "merchant" }]
    }
    """
    When I send a GET request to "/api/admin/legal-form/{{LEGAL_FORM_ID}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "error": "Forbidden"
    }
    """

  Scenario: List of legal-forms for admin
    When I send a GET request to "/api/admin/legal-form/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "legalForms": [
        {
          "_id": "{{LEGAL_FORM_ID}}",
          "abbreviation": "abbreviation",
          "country": "DE",
          "description": "description"
        }
      ]
    }
    """

  Scenario: List of legal-forms for admin with filters
    When I send a GET request to "/api/admin/legal-form/list?limit=10&page=1&projection=abbreviation country"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "legalForms": [
        {
          "abbreviation": "abbreviation",
          "country": "DE"
        }
      ]
    }
    """
    And the response should not contain json:
    """
    {
      "legalForms": [
        {
          "description": "description"
        }
      ]
    }
    """

  Scenario: Create a legal-form for admin
    When I send a POST request to "/api/admin/legal-form" with json:
    """
    {
      "id": "{{NEW_LEGAL_FORM_ID}}",
      "abbreviation": "NEW abbreviation",
      "country": "NEW DE",
      "description": "NEW description"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "{{NEW_LEGAL_FORM_ID}}",
      "abbreviation": "NEW abbreviation",
      "country": "NEW DE",
      "description": "NEW description"
    }
    """

  Scenario: Update a legal-form for admin
    When I send a PATCH request to "/api/admin/legal-form/{{LEGAL_FORM_ID}}" with json:
    """
    {
      "abbreviation": "UPDATED abbreviation",
      "description": "UPDATED description"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "abbreviation": "UPDATED abbreviation",
      "country": "DE",
      "description": "UPDATED description"
    }
    """

  Scenario: Delete a legal-form for admin
    When I send a GET request to "/api/admin/legal-form/{{LEGAL_FORM_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/legal-form/{{LEGAL_FORM_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "abbreviation": "abbreviation",
      "country": "DE",
      "description": "description"
    }
    """
    When I send a GET request to "/api/admin/legal-form/{{LEGAL_FORM_ID}}"
    Then the response status code should be 404
