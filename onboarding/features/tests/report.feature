Feature: Onboarding
  Background: Report db fixture
    Given I use DB fixture "report"
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
    When I send a POST request to "/api/report" with json:
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
    When I send a GET request to "/api/report/result/{{reportId}}"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
    """
    {
      "valid": [{ "_id": "*", "businessId": "test", "businessName": "test"}],
      "errors": [],
      "invalid": []
    }
    """

  Scenario: Delete Report
    When I send a DELETE request to "/api/report/{{reportId}}"
    Then print last response
    Then response status code should be 200
  