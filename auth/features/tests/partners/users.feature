Feature: PartnerController
  Background:
    And I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "service@payever.de",
        "roles": [
          {"name": "user", "permissions": []},
          {"name": "admin", "permissions": []}
        ]
      }
      """
    And I remember as "santanderPartner" following value:
    """
    "06916ce0-c9cc-401a-ac18-22fbce616521"
    """
    And I remember as "notaPartner" following value:
    """
    "426fafeb-132f-4ea1-96df-03bd993f126c"
    """


  Scenario: assign a partner tag to a merchant
    Given I use DB fixture "tags/users"

    When I send a PUT request to "/api/partner/{{santanderPartner}}/santander"

    Then print last response
    And the response status code should be 200
    And model "User" with id "{{notaPartner}}" should contain json:
    """
    {
      "roles": [{
        "partnerTags": ["santander"]
      }]
    }
    """


  Scenario: delete a partner tag from a merchant
    Given I use DB fixture "tags/users"

    When I send a DELETE request to "/api/partner/{{notaPartner}}/santander"

    Then print last response
    And the response status code should be 200
    And model "User" with id "{{santanderPartner}}" should not contain json:
    """
    {
      "roles": [{
        "partnerTags": ["santander"]
      }]
    }
    """
