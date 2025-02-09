Feature: Dashboard isDefault is true on init
  Background:
    Given I remember as "businessIdSetIsDefault" following value:
      """
      "8c60ed1c-d50b-495b-93a7-74668cc4cbd7"
      """

    Given I remember as "newDefaultDashboardId" following value:
      """
      "3aa0a192-362d-4a72-87e9-7525c50f07ca"
      """
    Given I remember as "prevDefaultDashboardId" following value:
      """
      "9969aa61-2361-4425-b0ef-94a45c7bd2d5"
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
                "businessId": "{{businessIdSetIsDefault}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    And I use DB fixture "cube"
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


  Scenario: Set default dashboard
    Given I use DB fixture "dashboard"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "dashboards",
          {
            "isDefault": false,
            "_id": "{{prevDefaultDashboardId}}",
            "businessId": "{{businessIdSetIsDefault}}",
            "id": "{{prevDefaultDashboardId}}"
          }
        ]
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "dashboards",
          {
            "isDefault": true,
            "_id": "{{newDefaultDashboardId}}",
            "businessId": "{{businessIdSetIsDefault}}",
            "id": "{{newDefaultDashboardId}}"
          }
        ]
      }
      """
    When I send a PUT request to "/api/business/{{businessIdSetIsDefault}}/dashboard/{{newDefaultDashboardId}}/set-as-default" with json:
      """
      {}
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{newDefaultDashboardId}}",
        "isDefault": true
      }
      """

