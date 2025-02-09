Feature: Products settings API
  Background:
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """

  Scenario: Get products settings for business
    Given I use DB fixture "api/product-settings/get-products-settings"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "5f02c4a8-929a-11e9-812b-7200004fe4c0", "acls": []}]
      }]
    }
    """
    When I send a GET request to "/product-app-settings/5f02c4a8-929a-11e9-812b-7200004fe4c0"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "welcomeShown": true,
      "currency": "EUR"
    }
    """
 
  Scenario: Get products settings for business when not authenticated
    Given I am not authenticated
    When I send a GET request to "/product-app-settings/5f02c4a8-929a-11e9-812b-7200004fe4c0"
    Then print last response
    Then the response status code should be 403

  Scenario: Get products settings for business when not authenticated as merchant
    Given I use DB fixture "api/product-settings/get-products-settings-when-not-authenticated-as-merchant"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "user",
        "permissions": [{"businessId": "5f02c4a8-929a-11e9-812b-7200004fe4c0", "acls": []}]
      }]
    }
    """
    When I send a GET request to "/product-app-settings/5f02c4a8-929a-11e9-812b-7200004fe4c0"
    Then print last response
    Then the response status code should be 403

  Scenario: Get products settings for business when not my business
    Given I use DB fixture "api/product-settings/get-products-settings-when-not-my-business"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "21f4947e-929a-11e9-bb05-7200004fe4c0", "acls": []}]
      }]
    }
    """
    When I send a GET request to "/product-app-settings/5f02c4a8-929a-11e9-812b-7200004fe4c0"
    Then print last response
    Then the response status code should be 403

  Scenario: Update products settings [sets welcomeShown to true]
    Given I use DB fixture "api/product-settings/update-products-settings"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "21f4947e-929a-11e9-bb05-7200004fe4c0", "acls": []}]
      }]
    }
    """
    When I send a POST request to "/product-app-settings/21f4947e-929a-11e9-bb05-7200004fe4c0"
    Then print last response
    Then the response status code should be 201

    When I send a GET request to "/product-app-settings/21f4947e-929a-11e9-bb05-7200004fe4c0"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
    """
    {
      "welcomeShown": true
    }
    """

  Scenario: Update products settings when business is not mine
    Given I use DB fixture "api/product-settings/update-products-settings-when-business-is-not-mine"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "5f02c4a8-929a-11e9-812b-7200004fe4c0", "acls": []}]
      }]
    }
    """
    When I send a POST request to "/product-app-settings/21f4947e-929a-11e9-bb05-7200004fe4c0"
    Then print last response
    Then the response status code should be 403
