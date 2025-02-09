Feature: Admin delete employee
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
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{
          "name": "admin",
          "permissions": [
            {
              "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
              "acls": []
            }
          ]
        }]
      }
      """

  Scenario: Bulk delete employee 
    Given I attach the file "delete-employee.csv" to "file"
    When I send a DELETE request to "/employees/bulk-delete" with form data:
    |||

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
          "Email": "employeeuser1@test.com"
      },
      {
          "Email": "employeeuser2@test.com"
      },
      {
          "Email": "onlyemployee@test.com"
      },
      {
          "Email": "onlyuser@test.com"
      }
    ]
    """
    And model "User" with id "8a13bd00-90f1-12e9-9f67-7200004fe4c2" should not exist
    And model "User" with id "8a13bd00-90f1-12e9-9f67-7200004fe4c2" should not exist
    And model "Employee" with id "8a13bd00-90f1-12e9-9f67-7200004fe4c1" should not exist
    And model "Employee" with id "8a13bd00-90f1-12e9-9f67-7200004fe4c2" should not exist
    And model "Employee" with id "8a13bd00-30f1-11e9-9f65-7200003fe4c2" should not exist



    