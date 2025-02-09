Feature: Admin endpoints
  Background:
    Given I remember as "cubeId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "dashboardId" following value:
      """
      "2a6171ec-6bbe-4c75-9997-e1bf7d6c08cd"
      """
    Given I remember as "widgetId" following value:
      """
      "31e5db1d-6f0c-431a-a921-db903e8d4447"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """
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

  Scenario: Get all dashboards
    Given I use DB fixture "cube"
    When I send a GET request to "/api/admin/cube"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{cubeId}}",
        "enabled": true,
        "code": "transactions",
        "name": "Transactions"
      }]
      """

  Scenario: toggleEnabled by id
    Given I use DB fixture "cube"
    When I send a POST request to "/api/admin/cube/{{cubeId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{cubeId}}",
        "enabled": false,
        "code": "transactions",
        "name": "Transactions"
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
            "name": "test"
          }
         ],
        "result": {}
      }
      """
    When I send a POST request to "/api/admin/dashboard" with json:
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
        "name": "test"
      }
      """

  Scenario: Get all dashboards
    Given I use DB fixture "dashboard"
    Given I use DB fixture "cube"
    When I send a GET request to "/api/admin/dashboard"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{dashboardId}}",
        "name": "*"
      }]
      """

  Scenario: Get dashboard by id
    Given I use DB fixture "dashboard"
    When I send a GET request to "/api/admin/dashboard/{{dashboardId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{dashboardId}}",
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
    When I send a PUT request to "/api/admin/dashboard/{{dashboardId}}" with json:
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
    When I send a DELETE request to "/api/admin/dashboard/{{dashboardId}}"
    Then print last response
    And the response status code should be 204
    When I send a GET request to "/api/admin/dashboard/{{dashboardId}}"
    Then print last response
    And the response status code should be 404

  Scenario: Create widget
    Given I use DB fixture "widget"
    When I send a POST request to "/api/admin/dashboard/{{dashboardId}}/widget" with json:
      """
      {
        "type": "transactions",
        "widgetSettings": [{
          "type": "size",
          "value": "small"
        }, {
          "type": "range",
          "value": "monthly"
        }, {
          "type": "viewType",
          "value": "table"
        }, {
          "type": "dateTimeFrom",
          "value": "2018-12-18T15:36:37Z"
        }, {
          "type": "dateTimeTo",
          "value": "2020-12-18T15:36:37Z"
        }]
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "_id": "*",
        "dashboard": "*",
        "type": "transactions",
        "widgetSettings": [{
          "type": "size",
          "value": "small"
        }, {
          "type": "range",
          "value": "monthly"
        }, {
          "type": "viewType",
          "value": "table"
        }, {
          "type": "dateTimeFrom",
          "value": "2018-12-18T15:36:37Z"
        }, {
          "type": "dateTimeTo",
          "value": "2020-12-18T15:36:37Z"
        }]
      }
      """

  Scenario: Get all businesses
    Given I use DB fixture "widget"
    When I send a GET request to "/api/admin/businesses"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      []
      """

  Scenario: Get all widgets
    Given I use DB fixture "widget"
    When I send a GET request to "/api/admin/dashboard/{{dashboardId}}/widget"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [{
        "_id": "*",
        "type": "transactions",
        "dashboard": "*",
        "widgetSettings": "*"
      }]
      """

  Scenario: Get widget by id
    Given I use DB fixture "widget"
    When I send a GET request to "/api/admin/dashboard/{{dashboardId}}/widget/{{widgetId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{widgetId}}",
        "type": "transactions",
        "dashboard": "*",
        "widgetSettings": "*"
      }
      """

  Scenario: Update widget
    Given I use DB fixture "widget"
    When I send a PUT request to "/api/admin/dashboard/{{dashboardId}}/widget/{{widgetId}}" with json:
      """
      {
        "type": "transactions",
        "widgetSettings": [{
          "type": "size",
          "value": "large"
        }, {
          "type": "range",
          "value": "monthly"
        }, {
          "type": "viewType",
          "value": "table"
        }, {
          "type": "dateTimeFrom",
          "value": "2018-12-18T15:36:37Z"
        }, {
          "type": "dateTimeTo",
          "value": "2020-12-18T15:36:37Z"
        }]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{widgetId}}",
        "type": "transactions",
        "dashboard": "*",
        "widgetSettings": [{
          "type": "size",
          "value": "large"
        }, {
          "type": "range",
          "value": "monthly"
        }, {
          "type": "viewType",
          "value": "table"
        }, {
          "type": "dateTimeFrom",
          "value": "2018-12-18T15:36:37Z"
        }, {
          "type": "dateTimeTo",
          "value": "2020-12-18T15:36:37Z"
        }]
      }
      """

  Scenario: Update widget settings
    Given I use DB fixture "widget"
    When I send a PUT request to "/api/admin/dashboard/{{dashboardId}}/widget/{{widgetId}}/settings" with json:
      """
      {
        "widgetSettings": [{
          "type": "size",
          "value": "large"
        }, {
          "type": "range",
          "value": "monthly"
        }, {
          "type": "viewType",
          "value": "table"
        }, {
          "type": "dateTimeFrom",
          "value": "2018-12-18T15:36:37Z"
        }, {
          "type": "dateTimeTo",
          "value": "2020-12-18T15:36:37Z"
        }]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{widgetId}}",
        "type": "transactions",
        "dashboard": "*",
        "widgetSettings": [{
          "type": "size",
          "value": "large"
        }, {
          "type": "range",
          "value": "monthly"
        }, {
          "type": "viewType",
          "value": "table"
        }, {
          "type": "dateTimeFrom",
          "value": "2018-12-18T15:36:37Z"
        }, {
          "type": "dateTimeTo",
          "value": "2020-12-18T15:36:37Z"
        }]
      }
      """

  Scenario: Delete widget
    Given I use DB fixture "widget"
    When I send a DELETE request to "/api/admin/dashboard/{{dashboardId}}/widget/{{widgetId}}"
    Then print last response
    And the response status code should be 204
    When I send a GET request to "/api/admin/dashboard/{{dashboardId}}/widget/{{widgetId}}"
    Then print last response
    And the response status code should be 404
