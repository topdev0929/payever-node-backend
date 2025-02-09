Feature: Patch domains
  Background:
    Given I remember as "businessId" following value:
      """
      "_id-of-business_1"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "_id-of-business_2"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}]
      }]
    }
    """

  Scenario: Update name of domain
    Given I use DB fixture "domains/basic-env"
    When I send a PATCH request to "/api/business/{{businessId}}/site/_id-of-site_1/domain/_id-of-domain_1" with json:
      """
      {
        "name": "new-name.org"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "new-name.org"
      }
      """

  Scenario: check of domain
    Given I use DB fixture "domains/basic-env"
    When I send a POST request to "/api/business/{{businessId}}/site/_id-of-site_1/domain/_id-of-domain_1/check"
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "cnames": [],
        "isConnected": false,
        "requiredIp": "*"
      }
      """

  Scenario: check of domain other site
    Given I use DB fixture "domains/basic-env"
    When I send a POST request to "/api/business/{{businessId}}/site/_id-of-site_1/domain/_id-of-domain_3/check"
    Then print last response
    And the response status code should be 400
