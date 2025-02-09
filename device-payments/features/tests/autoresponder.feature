Feature: Autoresponder
  Scenario: Correct autoresponder response
    Given I use DB fixture "checkouts"
    And I use DB fixture "applications"
    And I use DB fixture "businesses"
    And I set header "Accept" with value "application/xml"
    And I set header "Content-Type" with value "application/json"
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://media.*/api/storage"
      },
      "response": {
        "status": 200,
        "body": {"id": 123456}
      }
    }
    """

    When I send a POST request to "/api/v1/inbound/message" with json:
    """
    {
      "to": "+79528224321",
      "from": "+79528224321",
      "message": "123456"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "message": "https://checkout-wrapper-frontend.*/pay/restore-flow-from-code/123456 Default Application"
    }
    """
