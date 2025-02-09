@integration-subscriptions
Feature: Integration subscription
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["category-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "count" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["category-folder"], "result": [] }
      """
    Given I authenticate as a user with the following data:
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
    And I remember as "integrationId" following value:
    """
    "06b3464b-9ed2-4952-9cb8-07aac0108a55"
    """
    And I remember as "business1" following value:
    """
    "d5b25c5c-3684-4ab7-a769-c95f4c0f7546"
    """
    And I remember as "business2" following value:
    """
    "2135dc62-c904-4b2c-8aaa-73083c3b2a94"
    """
    And I remember as "business3" following value:
    """
    "64bd674a-158e-416e-94f4-649f35e859fa"
    """

  Scenario: get integrations sub that are active
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    When I send a GET request to "/api/business/{{business1}}/integration/active"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "integrations": [],
      "total": 0
    }
    """


  Scenario: get integrations subscription by category not installed
    And I use DB fixture "integrations/businesses"
    And I use DB fixture "integrations/integrations"
    When I send a GET request to "/api/business/{{business1}}/integration/category/Category_1"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "installed": false,
        "_id": "*",
        "integration": {
          "allowedBusinesses": [
            "d5b25c5c-3684-4ab7-a769-c95f4c0f7546"
          ],
          "enabled": true,
          "order": 1,
          "_id": "*",
          "category": "Category_1",
          "displayOptions": {
            "_id": "*",
            "title": "Title 1",
            "icon": "icon-1.png"
          },
          "installationOptions": {
            "countryList": [],
            "_id": "*",
            "links": [],
            "appSupport": "",
            "category": "Category_1",
            "description": "Description 1",
            "developer": " 1",
            "languages": "en, de",
            "optionIcon": "icon-1.png",
            "price": "0.00",
            "pricingLink": "",
            "website": ""
          },
          "name": "Name_1",
          "reviews": [],
          "timesInstalled": 1,
          "versions": []
        }
      }
    ]
    """
    Then look for model "IntegrationSubscription" by following JSON and remember as "integrationSubscriptions":
    """
    {
      "businessId": "{{business1}}"
    }
    """
    Then print storage key "integrationSubscriptions"
    And stored value "integrationSubscriptions" should contain json:
    """
    {
      "installed": false,
      "businessId": "d5b25c5c-3684-4ab7-a769-c95f4c0f7546",
      "integration": "06b3464b-9ed2-4952-9cb8-07aac0108a55"
    }
    """

  Scenario: get integrations subscription by category installed
    And I use DB fixture "integrations/businesses-installed"
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/integration-subscriptions-installed"
    When I send a GET request to "/api/business/{{business1}}/integration/category/Category_1"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "installed": true,
        "_id": "*",
        "integration": {
          "allowedBusinesses": [
            "d5b25c5c-3684-4ab7-a769-c95f4c0f7546"
          ],
          "enabled": true,
          "order": 1,
          "_id": "*",
          "category": "Category_1",
          "displayOptions": {
            "_id": "*",
            "title": "Title 1",
            "icon": "icon-1.png"
          },
          "installationOptions": {
            "countryList": [],
            "_id": "*",
            "links": [],
            "appSupport": "",
            "category": "Category_1",
            "description": "Description 1",
            "developer": " 1",
            "languages": "en, de",
            "optionIcon": "icon-1.png",
            "price": "0.00",
            "pricingLink": "",
            "website": ""
          },
          "name": "Name_1",
          "reviews": [],
          "timesInstalled": 1,
          "versions": []
        }
      }
    ]
    """
    Then look for model "IntegrationSubscription" by following JSON and remember as "integrationSubscriptions":
    """
    {
      "businessId": "{{business1}}"
    }
    """
    Then print storage key "integrationSubscriptions"
    And stored value "integrationSubscriptions" should contain json:
    """
    {
      "installed": true,
      "businessId": "d5b25c5c-3684-4ab7-a769-c95f4c0f7546",
      "integration": "06b3464b-9ed2-4952-9cb8-07aac0108a55"
    }
    """


  Scenario: get integrations sub not installed random
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    When I send a GET request to "/api/business/{{business1}}/integration/not-installed/random"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "installed": false,
        "_id": "*",
        "integration": {
          "allowedBusinesses": [
            "d5b25c5c-3684-4ab7-a769-c95f4c0f7546"
          ],
          "enabled": true,
          "order": 1,
          "_id": "*",
          "category": "Category_1",
          "displayOptions": {
            "_id": "*",
            "title": "Title 1",
            "icon": "icon-1.png"
          },
          "installationOptions": {
            "countryList": [],
            "_id": "*",
            "links": [],
            "appSupport": "",
            "category": "Category_1",
            "description": "Description 1",
            "developer": " 1",
            "languages": "en, de",
            "optionIcon": "icon-1.png",
            "price": "0.00",
            "pricingLink": "",
            "website": ""
          },
          "name": "Name_1",
          "reviews": [],
          "timesInstalled": 1,
          "versions": []
        }
      }
    ]
    """


  Scenario: get integrations sub by filtered by country
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    When I send a GET request to "/api/business/{{business1}}/integration/not-installed/random/filtered-by-country"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "installed": false,
        "_id": "*",
        "integration": {
          "allowedBusinesses": [
            "d5b25c5c-3684-4ab7-a769-c95f4c0f7546"
          ],
          "enabled": true,
          "order": 1,
          "_id": "*",
          "category": "Category_1",
          "displayOptions": {
            "_id": "*",
            "title": "Title 1",
            "icon": "icon-1.png"
          },
          "installationOptions": {
            "countryList": [],
            "_id": "*",
            "links": [],
            "appSupport": "",
            "category": "Category_1",
            "description": "Description 1",
            "developer": " 1",
            "languages": "en, de",
            "optionIcon": "icon-1.png",
            "price": "0.00",
            "pricingLink": "",
            "website": ""
          },
          "name": "Name_1",
          "reviews": [],
          "timesInstalled": 1,
          "versions": []
        }
      }
    ]
    """


  Scenario: get integrations by name
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    When I send a GET request to "/api/business/{{business1}}/integration/Name_1"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "installed": false,
      "name": "Name_1"
    }
    """


  Scenario: install integration previously not installed
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    When I send a PATCH request to "/api/business/{{business1}}/integration/Name_1/install"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "installed": true,
      "scopes": [
        "read_products"
      ]
    }
    """

  Scenario: install integration previously installed
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    And I use DB fixture "integrations/integration-subscriptions-uninstalled"
    When I send a PATCH request to "/api/business/{{business1}}/integration/Name_1/install"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "installed": true,
      "scopes": [
        "read_products"
      ]
    }
    """

  Scenario: install integration with registration
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    When I send a PATCH request to "/api/business/{{business1}}/integration/Name_1/registration/install"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "installed": true,
      "scopes": [
        "read_products"
      ]
    }
    """

  Scenario: registration installation should not throw error
    And I use DB fixture "integrations/businesses"
    When I send a PATCH request to "/api/business/{{business1}}/integration/Name_1/registration/install"

    Then print last response
    And the response status code should be 200

  Scenario: install integration via RPC
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    When I publish in RabbitMQ channel "async_events_connect_micro" message with json:
      """
      {
        "name": "connect.rpc.integration-subscriptions.install",
        "payload": {
          "businessId": "{{business1}}",
          "integrationName": "Name_1"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_connect_micro" channel
    Then look for model "IntegrationSubscription" by following JSON and remember as "subscription-1":
      """
      {
        "businessId": "{{business1}}",
        "integration": "{{integrationId}}"
      }
      """
    And print storage key "subscription-1"
    Then stored value "subscription-1" should contain json:
      """
      {
        "businessId": "{{business1}}",
        "integration": "{{integrationId}}",
        "installed": true,
        "scopes": [
          "read_products",
          "write_products"
        ]
      }
      """


  Scenario: uninstall integration
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    When I send a PATCH request to "/api/business/{{business1}}/integration/Name_1/uninstall"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "installed": false
    }
    """

  Scenario: uninstall integration via RPC
    And I use DB fixture "integrations/integrations"
    And I use DB fixture "integrations/businesses"
    When I publish in RabbitMQ channel "async_events_connect_micro" message with json:
      """
      {
        "name": "connect.rpc.integration-subscriptions.uninstall",
        "payload": {
          "businessId": "{{business1}}",
          "integrationName": "Name_1"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_connect_micro" channel
    Then look for model "IntegrationSubscription" by following JSON and remember as "subscription":
      """
      {
        "businessId": "{{business1}}",
        "integration": "{{integrationId}}"
      }
      """
    And print storage key "subscription"
    Then stored value "subscription" should contain json:
      """
      {
        "businessId": "{{business1}}",
        "integration": "{{integrationId}}",
        "installed": false
      }
      """
