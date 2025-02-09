Feature: language API

  Scenario: Get languages
    Given I use DB fixture "languages"
    When I send a GET request to "/api/language/list"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       [
           {
             "englishName": "en",
             "id": "language",
             "name": "English"
           }
         ]
      """