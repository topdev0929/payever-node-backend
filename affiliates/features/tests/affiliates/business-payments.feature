Feature: Business payments

  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "affiliateId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "affiliateBankId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab"
      """
    Given I remember as "affiliateBankIdTwo" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaae"
      """
    Given I remember as "businessPaymentId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaad"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Create new business payments
    Given I use DB fixture "business-payments"
    When I send a POST request to "/api/business/{{businessId}}/payments" with json:
      """
      {
        "payments": ["{{affiliateBankIdTwo}}"]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "payments": [
          "{{affiliateBankIdTwo}}"
        ],
        "_id": "*"
      }
    """
    And store a response as "response"
    And model "BusinessPayments" with id "{{response._id}}" should contain json:
      """
      {
        "business": "{{businessId}}",
        "payments": [
          "{{affiliateBankIdTwo}}"
        ]
      }
      """

  Scenario: get business payments
    Given I use DB fixture "business-payments"
    When I send a GET request to "/api/business/{{businessId}}/payments"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "payments": [
          "{{affiliateBankId}}"
        ],
        "_id": "*"
      }
    """

  Scenario: Update business payments
    Given I use DB fixture "business-payments"
    When I send a PATCH request to "/api/business/{{businessId}}/payments" with json:
      """
      {
        "payments": ["{{affiliateBankIdTwo}}"]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "payments": ["{{affiliateBankIdTwo}}"],
        "_id": "{{businessPaymentId}}"
      }
    """
    And store a response as "response"
    And model "BusinessPayments" with id "{{businessPaymentId}}" should contain json:
      """
      {
        "business": "{{businessId}}",
        "payments": ["{{affiliateBankIdTwo}}"]
      }
      """
