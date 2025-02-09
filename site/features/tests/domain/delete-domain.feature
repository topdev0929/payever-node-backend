Feature: Delete domains
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
  Scenario: Delete domain
    Given I use DB fixture "domains/basic-env"
    When I send a DELETE request to "/api/business/{{businessId}}/site/_id-of-site_2/domain/_id-of-domain_1"
    Then print last response
    And the response status code should be 204
