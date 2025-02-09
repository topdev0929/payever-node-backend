Feature: Read domains
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
  Scenario: Read by id
    Given I use DB fixture "domains/basic-env"
    When I send a GET request to "/api/business/{{businessId}}/site/_id-of-site_1/domain/_id-of-domain_1"
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
  Scenario: Read all by site
    Given I use DB fixture "domains/basic-env"
    When I send a GET request to "/api/business/{{businessId}}/site/_id-of-site_1/domain"
    Then print last response
    And the response should contain json:
      """
      [{
        "_id": "_id-of-domain_1"
      }, {
        "_id": "_id-of-domain_2"
      }]
      """

  Scenario: Get sites with domain
    Given I use DB fixture "sites/by-domain-not-live"
    When I send a GET request to "/api/site/by-domain?domain=domain123"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode": 404,
        "message": "Site with domain \"domain123\" not live"
      }
      """

  Scenario: Get sites with domain having no access config
    Given I use DB fixture "sites/get-list"
    When I send a GET request to "/api/site/by-domain?domain=_id-of-domain_1"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode": 404,
        "message": "Site with domain \"_id-of-domain_1\" not found"
      }
      """

  Scenario: Get theme by domain
    Given I use DB fixture "domains/basic-env"
    When I send a GET request to "/api/site/theme/by-domain?domain=mysite.com"
    Then print last response
    Then response status code should be 200
    And response should contain json:
    """
    {
      "applicationId": "_id-of-site_1",
      "data": {
        "productPages": "/products/:productId",
        "categoryPages": "/zubehor/:categoryId",
        "languages": [
          {
            "language": "english",
            "active": true
          },
          {
            "language": "german",
            "active": true
          }
        ],
        "defaultLanguage": "english"
      },
      "themeId": "660d35e4-5042-41fc-a475-4156646e9822",
      "businessId": "{{businessId}}",
      "versionNumber": 43
    }
    """

  Scenario: Get theme by domain
    Given I use DB fixture "domains/basic-env"
    When I send a GET request to "/api/site/theme/by-domain"
    Then print last response
    Then response status code should be 400