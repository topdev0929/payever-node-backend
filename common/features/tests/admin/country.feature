Feature: Admin endpoints for countries
  Background:
    Given I use DB fixture "countries"
    And I remember as "COUNTRY_ID" following value:
      """
      "countryCode"
      """
    And I remember as "NEW_COUNTRY_ID" following value:
      """
      "anotherOne"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "admin"
      }]
    }
    """

  Scenario: Get one country for admin
    When I send a GET request to "/api/admin/country/{{COUNTRY_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "{{COUNTRY_ID}}",
      "name": "name"
    }
    """

  Scenario: Get one continent for admin without admin rights
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{ "name": "merchant" }]
    }
    """
    When I send a GET request to "/api/admin/country/list"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "error": "Forbidden"
    }
    """

  Scenario: List of countries for admin
    When I send a GET request to "/api/admin/country/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "countries": [
        {
          "_id": "{{COUNTRY_ID}}",
          "capital": "capital",
          "continent": "continent",
          "currencies": ["currency"],
          "flagEmoji": "emoji",
          "flagUnicode": "emojiU",
          "languages": ["en", "ua"],
          "name": "name",
          "nativeName": "native",
          "phoneCode": 1234
        }
      ]
    }
    """

  Scenario: List of countries for admin with filters
    When I send a GET request to "/api/admin/country/list?limit=10&page=1&projection=name capital languages phoneCode"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "countries": [
        {
          "name": "name",
          "capital": "capital",
          "languages": ["en", "ua"],
          "phoneCode": 1234
        }
      ]
    }
    """
    And the response should not contain json:
    """
    {
      "countries": [
        {
          "currencies": ["currency"],
          "flagEmoji": "new_new_emoji",
          "flagUnicode": "new_emojiU"
        }
      ]
    }
    """
  Scenario: Create a country for admin
    When I send a POST request to "/api/admin/country" with json:
    """
    {
      "id": "{{NEW_COUNTRY_ID}}",
      "capital": "new_capital",
      "continent": "new_continent",
      "currencies": ["currency"],
      "flagEmoji": "new_new_emoji",
      "flagUnicode": "new_emojiU",
      "languages": ["new_en", "new_ua"],
      "name": "new_name",
      "nativeName": "new_native",
      "phoneCode": 12340001234
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "_id": "{{NEW_COUNTRY_ID}}",
      "capital": "new_capital",
      "continent": "new_continent",
      "currencies": ["currency"],
      "flagEmoji": "new_new_emoji",
      "flagUnicode": "new_emojiU",
      "languages": ["new_en", "new_ua"],
      "name": "new_name",
      "nativeName": "new_native",
      "phoneCode": 12340001234
    }
    """

  Scenario: Update a country for admin
    When I send a PATCH request to "/api/admin/country/{{COUNTRY_ID}}" with json:
    """
    {
      "name": "brand new name",
      "capital": "UPDATED capital"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "name": "brand new name",
      "capital": "UPDATED capital"
    }
    """

  Scenario: Delete a country for admin
    When I send a GET request to "/api/admin/country/{{COUNTRY_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/country/{{COUNTRY_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "name": "name"
    }
    """
    When I send a GET request to "/api/admin/country/{{COUNTRY_ID}}"
    Then the response status code should be 404
