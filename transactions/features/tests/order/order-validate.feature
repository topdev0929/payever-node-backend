@order-validate-v3
Feature: Order validate v3
  Background:
    Given I remember as "businessId" following value:
    """
    "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
    """

    Given I remember as "orderId" following value:
    """
    "915a88b0-1e5b-49df-90a4-6bb1ea29b880"
    """


  Scenario: Validate order
    Given I use DB fixture "business-events"
    Given I use DB fixture "order/order-validate"
    Given I authenticate as a user with the following data:
    """
    {"email": "email@email.com","roles": [{"name": "oauth","permissions": [{"businessId": "{{businessId}}","acls": []}]}]}
    """
    When I send a POST request to "/api/v3/order/{{orderId}}/validate" with json:
    """
    {
      "amount": 50
    }
    """
    Then print last response
    Then the response status code should be 200

  Scenario: Validate order failed, amount limit
    Given I use DB fixture "business-events"
    Given I use DB fixture "order/order-validate"
    Given I authenticate as a user with the following data:
    """
    {"email": "email@email.com","roles": [{"name": "oauth","permissions": [{"businessId": "{{businessId}}","acls": []}]}]}
    """
    When I send a POST request to "/api/v3/order/{{orderId}}/validate" with json:
    """
    {
      "amount": 100
    }
    """
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
    """
    {
      "statusCode": 400,
      "message": "Submitted amount 100 is more than amount left 50",
      "error": "Bad Request"
    }
    """
