Feature: Trusted domain whitelisting controller with employee without access.
  Background:
    Given I remember as "businessId" following value:
      """
      "88038e2a-90f9-11e9-a492-7200004fe4c0"
      """
    Given I use DB fixture "employee"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "firstName": "firstname",
        "lastName": "lastname",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
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
          }
        ]
      }
      """
  
  Scenario: Add domain 
    When I send a POST request to "/trusted-domain/{{businessId}}" with json:
      """
      {
        "domain": "employee2@domain.com",
        "businessId": "{{businessId}}"
      }
      """
    And print last response
    Then the response status code should be 403
    And response should contain json:
      """
      {
        "message": "*",
        "statusCode": 403
      }
      """
  Scenario: Delete domain 
    When I send a DELETE request to "/trusted-domain/{{businessId}}" with json:
      """
      {
        "domain": "employee123@domain123.com123"
      }
      """
    And print last response
    Then the response status code should be 403
    And response should contain json:
      """
      {
        "message": "*",
        "statusCode": 403
      }
      """
  Scenario: Get domains 
    When I send a GET request to "/trusted-domain/{{businessId}}"
    And print last response
    Then the response status code should be 403
    And response should contain json:
      """
      {
        "message": "*",
        "statusCode": 403
      }
      """