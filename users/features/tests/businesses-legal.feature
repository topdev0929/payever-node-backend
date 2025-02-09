Feature: Business
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
          "name": "merchant",
          "permissions": [{"businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", "acls": []}]
        }]
      }
      """
  Scenario: Create business legal docs
    When I send a PUT request to "/business/{{businessId}}/legal-document/shipping_policy" with json:
    """
    {
      "content": "content test"
    }
    """
    Then print last response
    Then the response status code should be 200
    When I send a GET request to "/business/{{businessId}}/legal-document/shipping_policy"
    Then print last response
    Then response should contain json:
    """
    {
      "content": "content test"
    }
    """

  Scenario: Create business legal docs with html tags (should sanitize)
    When I send a PUT request to "/business/{{businessId}}/legal-document/disc" with json:
    """
    {
      "content": "content test <script>alert(0)</script>"
    }
    """
    Then print last response
    Then the response status code should be 200
    When I send a GET request to "/business/{{businessId}}/legal-document/disc"
    Then print last response
    Then response should contain json:
    """
    {
      "content": "content test"
    }
    """
