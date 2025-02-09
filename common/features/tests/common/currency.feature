Feature: currency API

  Scenario: Get currency
    Given I use DB fixture "currencies"
    When I send a GET request to "/api/currency/list"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       [
           {
             "code": "currencyCode",
             "id": "currencyCode",
             "name": "currency",
             "symbol": "currenciesMap"
           }
         ]
      """