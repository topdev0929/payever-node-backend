Feature: Create domains
  Background:
    Given I remember as "businessId" following value:
      """
      "_id-of-business_1"
      """
     Given I remember as "domainName" following value:
      """
      "promo129.example.com"
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

  Scenario: Create domain at another business
    Given I use DB fixture "domains/basic-env"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "sites",
          {
          }
         ],
        "result": {}
      }
      """
    When I send a POST request to "/api/business/{{anotherBusinessId}}/site/_id-of-site_1/domain" with json:
      """
      {
        "name": "promo129.example.com",
        "provider": "alexa"
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: Create domain at another site
    Given I use DB fixture "domains/basic-env"
    When I send a POST request to "/api/business/{{businessId}}/site/_id-of-site_2/domain" with json:
    """
      {
        "name": "promo129.example.com",
        "provider": "alexa"
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: Create domain
    Given I use DB fixture "domains/basic-env"
    When I send a POST request to "/api/business/{{businessId}}/site/_id-of-site_1/domain" with json:
      """
      {
        "name": "promo129.example.com",
        "provider": "alexa"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "name": "promo129.example.com",
        "provider": "alexa",
        "isConnected": false,
        "site": "_id-of-site_1",
        "_id": "*",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Create domain, domain already used
    Given I use DB fixture "domains/basic-env"
    When I send a POST request to "/api/business/{{businessId}}/site/_id-of-site_1/domain" with json:
      """
      {
        "name": "google.com",
        "provider": "alexa"
      }
      """
    Then print last response
    And the response status code should be 409

  Scenario: Create domain, domain name is not fqdn
    Given I use DB fixture "domains/basic-env"
    When I send a POST request to "/api/business/{{businessId}}/site/_id-of-site_1/domain" with json:
      """
      {
        "name": "first-ever-domain",
        "provider": "alexa"
      }
      """
    Then print last response
    And the response status code should be 400
