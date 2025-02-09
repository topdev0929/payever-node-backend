Feature: tax API

  Scenario: Get taxes
    Given I use DB fixture "taxes"
    When I send a GET request to "/api/tax/list/DE"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       [
           {
             "country": "DE",
             "description": "Standard VAT rate",
             "id": "*",
             "rate": 19
           },
           {
             "country": "DE",
             "description": "Reduced VAT rate",
             "id": "*",
             "rate": 7
           }
         ]
      """