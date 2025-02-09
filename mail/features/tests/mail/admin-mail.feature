Feature: Admin endpoints for mails
  Background:
    Given I use DB fixture "mail/mail"
    And I remember as "MAIL_ID" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "BUSINESS_ID" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "NEW_BUSINESS_ID" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "admin"
      }]
    }
    """

  Scenario: Get one mail for admin
    When I send a GET request to "/api/admin/mail/{{MAIL_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "name": "business test"
    }
    """

  Scenario: List of mails for admin
    When I send a GET request to "/api/admin/mail/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "mails": [
        {
          "name": "business test"
        }
      ]
    }
    """

    Scenario: List of mails for admin with filters
    When I send a GET request to "/api/admin/mail/list?limit=10&page=1&businessIds={{BUSINESS_ID}}&projection=name businessId"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "mails": [
        {
          "businessId": "{{BUSINESS_ID}}",
          "name": "business test"
        }
      ]
    }
    """

  Scenario: Create a mail for admin
    When I send a POST request to "/api/admin/mail" with json:
    """
    {
      "businessId": "{{NEW_BUSINESS_ID}}",
      "name": "test mail"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "mail": {
        "businessId": "{{NEW_BUSINESS_ID}}",
        "name": "test mail"
      }
    }
    """

  Scenario: Update a mail for admin
    When I send a PATCH request to "/api/admin/mail/{{MAIL_ID}}" with json:
    """
    {
      "name": "UPDATED test mail"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "mail": {
        "name": "UPDATED test mail"
      }
    }
    """

  Scenario: Delete a mail for admin
    When I send a GET request to "/api/admin/mail/{{MAIL_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/mail/{{MAIL_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "mail" : {
        "name": "business test"
      }
    }
    """
    When I send a GET request to "/api/admin/mail/{{MAIL_ID}}"
    Then the response status code should be 404