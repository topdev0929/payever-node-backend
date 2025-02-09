Feature: continent API

  Scenario: Get continent
    Given I use DB fixture "continents"
    When I send a GET request to "/api/continent/list"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       [
           {
             "id": "continentCode",
             "name": "name"
           }
         ]
      """
