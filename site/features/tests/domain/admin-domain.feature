Feature: Admin domain
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "siteId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """



    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: Only admin role has access to admin endpoint
    Given I authenticate as a user with the following data:
      """
      {
        "roles": [
          {
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/api/admin/domains"
    Then response status code should be 403

  Scenario: Read all domains
    Given I use DB fixture "domains/basic-env"
    When I send a GET request to "/api/admin/domains"
    Then response status code should be 200
    Then print last response
    And the response should contain json:
      """
      {
        "documents": [
          {
            "_id": "_id-of-domain_1"
          },
          {
            "_id": "_id-of-domain_2"
          }
        ]
      }
      """

  Scenario: Get by id
    Given I use DB fixture "domains/basic-env"
    When I send a GET request to "/api/admin/domains/_id-of-domain_1"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "google.com",
        "provider": "provider-name",
        "isConnected": false,
        "site": "_id-of-site_1",
        "_id": "_id-of-domain_1"
      }
      """

  Scenario: Create domain
    Given I use DB fixture "domains/basic-env"
    When I send a POST request to "/api/admin/domains" with json:
      """
      {
        "businessId": "{{businessId}}",
        "siteId": "_id-of-site_1",
        "name": "promo129.example.com",
        "provider": "alexa"
      }
      """
    Then print last response
    And the response status code should be 200
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
    When I send a POST request to "/api/admin/domains" with json:
      """
      {
        "businessId": "{{businessId}}",
        "siteId": "_id-of-site_1",
        "name": "google.com",
        "provider": "alexa"
      }
      """
    Then print last response
    And the response status code should be 409

  Scenario: Create domain, domain name is not fqdn
    Given I use DB fixture "domains/basic-env"
    When I send a POST request to "/api/admin/domains" with json:
      """
      {
        "businessId": "{{businessId}}",
        "siteId": "_id-of-site_1",
        "name": "first-ever-domain",
        "provider": "alexa"
      }
      """
    Then print last response
    And the response status code should be 400

  Scenario: check of domain
    Given I use DB fixture "domains/basic-env"
    When I send a GET request to "/api/admin/domains/_id-of-domain_1/check"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "cnames": [],
        "isConnected": false,
        "requiredIp": "*"
      }
      """

  Scenario: Update name of domain
    Given I use DB fixture "domains/basic-env"
    When I send a PATCH request to "/api/admin/domains/_id-of-domain_1" with json:
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

  Scenario: Delete domain
    Given I use DB fixture "domains/basic-env"
    When I send a DELETE request to "/api/admin/domains/_id-of-domain_1"
    Then print last response
    And the response status code should be 200
