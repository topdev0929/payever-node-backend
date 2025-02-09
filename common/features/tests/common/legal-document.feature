Feature: legal-document API

  Scenario: Get legal-document
    Given I use DB fixture "legal-documents"
    When I send a GET request to "/api/legal-document/list"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       [
           {
             "content": "string",
             "id": "*",
             "type": "disclaimer"
           }
         ]
      """