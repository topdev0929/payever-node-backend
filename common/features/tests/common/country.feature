Feature: countr API

  Scenario: Get country
    Given I use DB fixture "countries"
    When I send a GET request to "/api/country/list"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       [
           {
             "capital": "capital",
             "continent": "continent",
             "currencies": [
               "currency"
             ],
             "flagEmoji": "emoji",
             "flagUnicode": "emojiU",
             "id": "countryCode",
             "languages": [ "en", "ua" ],
             "name": "name",
             "nativeName": "native"
           }
         ]
      """