Feature: Page management
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
    And I use DB fixture "integrations/businesses"
    And I use DB fixture "integrations/integrations"
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


  Scenario: get integrations list filtered by allowed businesses
    When I send a GET request to "/api/business/{{business1}}/integration"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "integrations": [{
        "integration": {
          "allowedBusinesses": [ "{{business1}}" ]
        }
      }]
    }
    """


  Scenario: get integrations list filtered by allowed businesses
    When I send a GET request to "/api/business/{{business2}}/integration"

    Then print last response
    And the response status code should be 200
    And the response should not contain json:
    """
    {
      "integrations": [{
        "integration": { "allowedBusinesses": [] }
      }]
    }
    """


  Scenario: edit allowed businesses list
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

    When I send a PATCH request to "/api/integrations-management/{{integrationId}}" with json:
    """
    { "allowedBusinesses": ["{{business1}}", "{{business2}}"] }
    """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    { "allowedBusinesses": ["{{business1}}", "{{business2}}"] }
    """
    And model "Integration" with id "{{integrationId}}" should contain json:
    """
    { "allowedBusinesses": ["{{business1}}", "{{business2}}"] }
    """

  Scenario: get integrations list
    When I send a GET request to "/api/integration"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
           {
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
         ]
    """

  Scenario: get integrations list by category
    When I send a GET request to "/api/integration/category/Category_1"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
           {
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
         ]
    """

  Scenario: add rating, review, version and get integrations list by name
    When I send a PATCH request to "/api/integration/Name_1/rate" with json:
    """
    {
      "rating": 5
    }
    """
    Then print last response
    And the response status code should be 200
    When I send a PATCH request to "/api/integration/Name_1/add-review" with json:
    """
    {
      "title": "rate",
      "text": "new message",
      "rating": 5
    }
    """
    Then print last response
    And the response status code should be 200
    When I send a PATCH request to "/api/integration/Name_1/add-version" with json:
    """
    {
      "version": "1.0",
      "description": "new message",
      "versionDate": "Thu, 22 Apr 2021 12:51:33 GMT",
      "_id": "new_version1"
    }
    """
    Then print last response
    And the response status code should be 200
    When I send a GET request to "/api/integration/Name_1"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
           {
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
    """
    When I send a GET request to "/api/integration/Name_1/versions"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
       [
           {
             "version": "1.0",
             "description": "new message",
             "versionDate": "Thu, 22 Apr 2021 12:51:33 GMT",
             "_id": "*"
           }
         ]
    """

  Scenario: create integrations
    When I send a POST request to "/api/integration" with json:
    """
    {
             "category": "Category_2",
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
               "category": "Category_2",
               "description": "Description 1",
               "developer": " 1",
               "languages": "en, de",
               "optionIcon": "icon-1.png",
               "price": "0.00",
               "pricingLink": "",
               "website": ""
             },
             "name": "Name_2",
             "categoryIcon": "icon-1.png"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "allowedBusinesses": [],
      "enabled": true,
      "order": 1000,
      "category": "Category_2",
      "name": "Name_2",
      "categoryIcon": "icon-1.png",
      "_id": "*",
      "reviews": [],
      "versions": []
    }
    """

    Scenario: Get integration scopes
      When I send a GET request to "/api/integration/Name_1/scopes"
      Then print last response
      And the response status code should be 200
      And the response should contain json:
      """
      [
        "read_products",
        "write_products"
      ]
      """
