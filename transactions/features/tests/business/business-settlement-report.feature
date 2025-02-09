@export
Feature: Transaction export for business
  Background:
    Given I remember as "businessId" following value:
      """
      "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
      """
    Given I remember as "anotherBusinessId" following value:
      """
      "36bf8981-8827-4c0c-a645-02d9fc6d72c9"
      """
    Given I remember as "operation_type" following value:
      """
      "paid"
      """
    Given I remember as "not_allowed_operation_type" following value:
      """
      "accepted"
      """
    Given I remember as "paymentId" following value:
      """
      "c3735d0c-b70a-4e1c-9434-c8239deb6391"
      """
    Given I remember as "anotherPaymentId" following value:
      """
      "c3735d0c-b70a-4e1c-9434-c8239deb6390"
      """
    Given I remember as "wrongPaymentId" following value:
      """
      "c3735d0c-aaaa-4e1c-9434-c8239deb6390"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com"
      }
      """

  Scenario: User doesn't have permission to export report
    When I send a GET request to "/api/settlements/reports?payment_method=paypal"
    Then print last response
    And the response status code should be 403
    When I send a GET request to "/api/settlements/{{paymentId}}"
    Then print last response
    And the response status code should be 403

  Scenario: User with another businessId doesn't have permission to export report
    Given I use DB fixture "transactions"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{anotherBusinessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/settlements/{{paymentId}}"
    Then print last response
    And the response status code should be 403


  Scenario: Settlement report testing
    Given I use DB fixture "transactions"
    And I authenticate as a user with the following data:
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
    When I send a GET request to "/api/settlements/reports"
    Then print last response
    And the response status code should be 400

    When I send a GET request to "/api/settlements/reports?operation_type={{not_allowed_operation_type}}"
    Then print last response
    And the response status code should be 400

    When I send a GET request to "/api/settlements/reports?start_date=2022-01-06&end_date=2022-02-07&payment_method=paypal&operation_type={{operation_type}}"
    Then print last response
    And the response status code should be 200

    When I send a GET request to "/api/settlements/{{paymentId}}"
    Then print last response
    And the response status code should be 200

    When I send a GET request to "/api/settlements/{{anotherPaymentId}}"
    Then print last response
    And the response status code should be 404

    When I send a GET request to "/api/settlements/{{wrongPaymentId}}"
    Then print last response
    And the response status code should be 404

  Scenario: Settlement report testing with oauth
    Given I use DB fixture "transactions"
    And I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "{{businessId}}"
            }
          ]
        }
      ]
    }
    """
    When I send a GET request to "/api/settlements/reports"
    Then print last response
    And the response status code should be 400

    When I send a GET request to "/api/settlements/reports?operation_type={{not_allowed_operation_type}}"
    Then print last response
    And the response status code should be 400

    When I send a GET request to "/api/settlements/reports?start_date=2022-01-06&end_date=2022-02-07&payment_method=paypal&operation_type={{operation_type}}"
    Then print last response
    And the response status code should be 200

    When I send a GET request to "/api/settlements/{{paymentId}}"
    Then print last response
    And the response status code should be 200

    When I send a GET request to "/api/settlements/{{anotherPaymentId}}"
    Then print last response
    And the response status code should be 404

    When I send a GET request to "/api/settlements/{{wrongPaymentId}}"
    Then print last response
    And the response status code should be 404
