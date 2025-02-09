Feature: Onboarding
  Background: Report db fixture
    Given I use DB fixture "report"
    Given I use DB fixture "employee"
    Given I remember as "bulkImportId" following value:
      """
      "2fa45a9b-b11a-424d-8e71-0e09139bd38c"
      """
    Given I remember as "bulkImportId2" following value:
      """
      "1fa45a9b-b11a-424d-8e71-0e09129bd383"
      """
    Given I remember as "reportId" following value:
      """
      "2fa45a9b-b11a-424d-8e71-0e09139bd38b"
      """
    Given I remember as "businessId" following value:
      """
      "88038e2a-90f9-11e9-a492-7200004fe4c0"
      """
    Given I remember as "employeeId" following value:
      """
      "8a13bd00-90f1-11e9-9f67-7200004fe4c2"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "08a3fac8-43ef-4998-99aa-cabc97a39261",
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": []
          }
        ]
      }
      """
  
  Scenario: Generate Report
    When I send a POST request to "/report" with json:
    """
    {
      "bulkImportId": "{{bulkImportId2}}"
    }
    """
    Then print last response
    Then response status code should be 201
    And the response should contain json:
    """
    {
      "reportId": "*"
    }
    """

  Scenario: Get report result
    When I send a GET request to "/report/result/{{reportId}}"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
    """
    {
      "valid": [{ "_id": "*" }],
      "errors": [],
      "invalid": []
    }
    """

  Scenario: Delete Report
    When I send a DELETE request to "/report/{{reportId}}"
    Then print last response
    Then response status code should be 200

  Scenario: Process report
    When I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "user.internal.event.generate-report",
        "payload": {
          "reportId": "{{reportId}}"
        }
      }
      """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "patch",
        "url": "*/api/business/df4c7b7b-c33e-4643-810f-c50420cbeebc/enable",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
          "Authorization": "Bearer token",
          "User-Agent": "user-agent"
        },
        "body": "{}"
      },
      "response": {
        "status": 200,
        "body": {
          "accessToken": "token",
          "refreshToken": "token"
        }
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "*/api/employees/business/df4c7b7b-c33e-4643-810f-c50420cbeebc/get-acls/8a13bd00-90f1-11e9-9f67-7200004fe4c2",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Authorization": "Bearer token",
          "User-Agent": "user-agent"
        }
      },
      "response": {
        "status": 200,
        "body": {
          "acls": [{
            "microservice": "pos",
            "create": true,
            "read": true,
            "delete": true,
            "update": true
          }]
        }
      }
    }
    """
    And I process messages from RabbitMQ "async_events_users_micro" channel
    And look for model "ReportDetail" by following JSON and remember as "reportDetail":
      """
      { "report": "{{reportId}}" }
      """
    And stored value "reportDetail" should contain json:
      """
      { 
        "_id": "*",
        "valid": true
      }
      """
  