Feature: Dashboard endpoints
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "dashboardId" following value:
      """
      "2a6171ec-6bbe-4c75-9997-e1bf7d6c08cd"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    And I use DB fixture "cube"
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "dashboard-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "dashboard-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "dashboard-folder",
          {}
         ],
        "result": {}
      }
      """

  Scenario: Create dashboard
    Given I use DB fixture "dashboard"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "dashboards",
          {
            "businessId": "{{businessId}}",
            "name": "test"
          }
         ],
        "result": {}
      }
      """
    When I send a POST request to "/api/business/{{businessId}}/dashboard" with json:
      """
      {
        "name": "test"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "_id": "*",
        "business": {
          "_id": "{{businessId}}"
        },
        "name": "test"
      }
      """

  Scenario: Get all dashboards
    Given I use DB fixture "dashboard"
    When I send a GET request to "/api/business/{{businessId}}/dashboard"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{dashboardId}}",
        "business": {
          "_id": "{{businessId}}"
        },
        "name": "*"
      }]
      """

  Scenario: Get dashboard by id
    Given I use DB fixture "dashboard"
    When I send a GET request to "/api/business/{{businessId}}/dashboard/{{dashboardId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{dashboardId}}",
        "business": {
          "_id": "{{businessId}}"
        },
        "name": "*"
      }
      """

  Scenario: Update dashboard
    Given I use DB fixture "dashboard"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "dashboards",
          {
            "_id": "{{dashboardId}}",
            "name": "new_name"
          }
         ],
        "result": {}
      }
      """
    When I send a PUT request to "/api/business/{{businessId}}/dashboard/{{dashboardId}}" with json:
      """
      {
        "name": "new_name"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{dashboardId}}",
        "business": {
          "_id": "{{businessId}}"
        },
        "name": "new_name"
      }
      """

  Scenario: Delete dashboard
    Given I use DB fixture "dashboard"
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "dashboards",
          {
            "query": {
              "match_phrase": {
                "mongoId": "{{dashboardId}}"
              }
            }
          }
         ],
        "result": {}
      }
      """
    When I send a DELETE request to "/api/business/{{businessId}}/dashboard/{{dashboardId}}"
    Then print last response
    And the response status code should be 204
    When I send a GET request to "/api/business/{{businessId}}/dashboard/{{dashboardId}}"
    Then print last response
    And the response status code should be 404
