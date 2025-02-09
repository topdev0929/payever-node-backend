Feature: Attribute features
  Background:
    Given I use DB fixture "subscription.media"
    Given I use DB fixture "business"
    Given I use DB fixture "attribute"
    Given I remember as "businessId2" following value:
      """
        "3b1eb897-a009-4ff6-a850-3b1d3399f147"
      """
    Given I remember as "attributeId" following value:
      """
        "64a19c1b-4ea0-4675-aafb-f50c2e3ab12d"
      """
    Given I remember as "invalidAttributeId" following value:
      """
        "64a19c1b-4ea0-4675-aafb-f50c2e3ab122"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "merchant"
        }]
      }
      """

  Scenario: Invalid Access Create attribute
    When I send a POST request to "/api/attribute" with json:
      """
      {
        "name": "white",
        "type": "color"
      }
      """
    Then print last response
    Then the response status code should be 403

  Scenario: Invalid Access Update attribute
    When I send a PATCH request to "/api/attribute/{{attributeId}}" with json:
      """
      {
        "name": "white",
        "type": "color"
      }
      """
    Then print last response
    Then the response status code should be 403

  Scenario: Invalid Access Get attribute
    When I send a GET request to "/api/attribute?page=1&limit=3"
    Then print last response
    Then the response status code should be 403

  Scenario: Invalid Access Get attribute by id
    When I send a GET request to "/api/attribute/{{attributeId}}"
    Then print last response
    Then the response status code should be 403

  Scenario: Invalid Access Delete attribute by id
    When I send a DELETE request to "/api/attribute/{{attributeId}}"
    Then print last response
    Then the response status code should be 403
