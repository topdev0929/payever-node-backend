Feature: Slug controller
  Background: 
    Given I remember as "businessId" following value:
      """
      "88038e2a-90f9-11e9-a492-7200004fe4c0"
      """
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{
          "name": "user",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """

  Scenario: Get employee
    When I send a GET request to "/slug/business/test/home"
    And print last response
    Then the response status code should be 200
    And model "BusinessSlug" with id "88038e2a-90f9-11e9-a492-7200004fe4c0" should contain json:
    """
    {
      "used": 3
    }
    """
