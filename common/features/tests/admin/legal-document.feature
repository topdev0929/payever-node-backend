Feature: Admin endpoints for legal-documents
  Background:
    Given I use DB fixture "legal-documents"
    And I remember as "LEGAL_DOCUMENT_ID" following value:
      """
      "legal-doc-ument-3j8"
      """
    And I remember as "NEW_LEGAL_DOCUMENT_ID" following value:
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

  Scenario: Get one legal-document for admin
    When I send a GET request to "/api/admin/legal-document/{{LEGAL_DOCUMENT_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "{{LEGAL_DOCUMENT_ID}}",
      "content": "string",
      "type": "disclaimer"
    }
    """

  Scenario: Get one legal-document for admin without admin rights
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{ "name": "merchant" }]
    }
    """
    When I send a GET request to "/api/admin/legal-document/{{LEGAL_DOCUMENT_ID}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "error": "Forbidden"
    }
    """

  Scenario: List of legal-documents for admin
    When I send a GET request to "/api/admin/legal-document/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "legalDocuments": [
        {
          "_id": "{{LEGAL_DOCUMENT_ID}}",
          "content": "string",
          "type": "disclaimer"
        }
      ]
    }
    """

  Scenario: List of legal-documents for admin with filters
    When I send a GET request to "/api/admin/legal-document/list?limit=10&page=1&projection=type"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "legalDocuments": [
        {
          "type": "disclaimer"
        }
      ]
    }
    """
    And the response should not contain json:
    """
    {
      "legalDocuments": [
        {
          "content": "string"
        }
      ]
    }
    """

  Scenario: Create a legal-document for admin
    When I send a POST request to "/api/admin/legal-document" with json:
    """
    {
      "id": "{{NEW_LEGAL_DOCUMENT_ID}}",
      "content": "NEW string",
      "type": "privacy_statements"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "{{NEW_LEGAL_DOCUMENT_ID}}",
      "content": "NEW string",
      "type": "privacy_statements"
    }
    """

  Scenario: Update a legal-document for admin
    When I send a PATCH request to "/api/admin/legal-document/{{LEGAL_DOCUMENT_ID}}" with json:
    """
    {
      "content": "UPDATED string",
      "type": "shipping_policy"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "content": "UPDATED string",
      "type": "shipping_policy"
    }
    """

  Scenario: Delete a legal-document for admin
    When I send a GET request to "/api/admin/legal-document/{{LEGAL_DOCUMENT_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/legal-document/{{LEGAL_DOCUMENT_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "content": "string",
      "type": "disclaimer"
    }
    """
    When I send a GET request to "/api/admin/legal-document/{{LEGAL_DOCUMENT_ID}}"
    Then the response status code should be 404
