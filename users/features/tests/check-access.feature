Feature: Check access
  Background: 
    Given I remember as "businessId" following value:
      """
      "88038e2a-90f9-11e9-a492-7200004fe4c0"
      """
    Given I use DB fixture "employee"
    Given I use DB fixture "businesses"


  Scenario: Check access
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {
              "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", 
              "acls": [
                {
                  "create": true,
                  "read": true,
                  "update": true,
                  "delete": true,
                  "microservice": "commerceos"
                }
              ]
            }
          ]
        }]
      }
      """

    When I send a GET request to "/business/{{businessId}}/check-access/settings"
    And print last response
    Then the response status code should be 200

  Scenario: Check access
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {
              "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0", 
              "acls": [
                {
                  "create": false,
                  "read": false,
                  "update": false,
                  "delete": false,
                  "microservice": "settings"
                }
              ]
            }
          ]
        }]
      }
      """
    When I send a GET request to "/business/{{businessId}}/check-access/settings"
    And print last response
    Then the response status code should be 403