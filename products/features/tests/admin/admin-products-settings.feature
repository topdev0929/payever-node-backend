Feature: Admin products settings API
  Background:
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "product-collection",
          {}
        ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-collection",
          {}
        ],
        "result": {}
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
    When I send a GET request to "/admin/product-app-settings/5f02c4a8-929a-11e9-812b-7200004fe4c0"
    Then response status code should be 403

  Scenario: Get products settings for business
    Given I use DB fixture "api/product-settings/get-products-settings"
    When I send a GET request to "/admin/product-app-settings/5f02c4a8-929a-11e9-812b-7200004fe4c0"
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
    When I send a GET request to "/admin/product-app-settings/5f02c4a8-929a-11e9-812b-7200004fe4c0"
    Then print last response
    Then the response status code should be 403

  Scenario: Update products settings [sets welcomeShown to true]
    Given I use DB fixture "api/product-settings/update-products-settings"
    When I send a POST request to "/admin/product-app-settings/21f4947e-929a-11e9-bb05-7200004fe4c0"
    Then print last response
    Then the response status code should be 201
    When I send a GET request to "/admin/product-app-settings/21f4947e-929a-11e9-bb05-7200004fe4c0"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      {
        "welcomeShown": true
      }
      """
