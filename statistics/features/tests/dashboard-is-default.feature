Feature: Dashboard isDefault is true on init
  Background:
    Given I remember as "businessIdIsDefault" following value:
      """
      "928bed1f-337c-4a3d-8025-5b0bb8f827f4"
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
                "businessId": "{{businessIdIsDefault}}",
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
  Scenario: Create dashboard - IsDefault should be true for the first dashboard
    Given I use DB fixture "dashboard"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "dashboards",
          {
            "businessId": "{{businessIdIsDefault}}",
            "name": "test"
          }
         ],
        "result": {}
      }
      """
    When I send a POST request to "/api/business/{{businessIdIsDefault}}/dashboard" with json:
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
          "_id": "{{businessIdIsDefault}}"
        },
        "name": "test",
        "isDefault": true
      }
      """