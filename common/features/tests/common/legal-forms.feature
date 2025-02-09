Feature: legal-form API

  Scenario: Get legal-form
    Given I use DB fixture "legal-forms"
    When I send a GET request to "/api/legal-form/list/DE"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       [
           {
             "abbreviation": "abbreviation",
             "country": "DE",
             "description": "description",
             "id": "*"
           }
         ]
      """