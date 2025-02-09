Feature: Admin employees controller
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
    Given I mock RPC request "users.rpc.employee.created" to "users.rpc.employee.created" with:
      """
      {
        "requestPayload": "*",
        "responsePayload": [{ "success": true }]
      }
      """

  Scenario: Bulk multiple business employees import
    Given I attach the file "multiple-business-employees-import.csv" to "file"
    When I send a POST request to "/admin/employees/bulk-create" with form data:
    |||

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "isVerified": false,
        "userId": null,
        "email": "test1@gmail.com",
        "language": "en",
        "positions": [
          {
            "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
            "positionType": "Others",
            "status": 0
          }
        ],
        "_id": "*",
        "__v": 0,
        "id": "*"
      },
      {
        "isVerified": false,
        "userId": null,
        "email": "test2@gmail.com",
        "language": "en",
        "positions": [
          {
            "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
            "positionType": "Admin",
            "status": 0
          }
        ],
        "_id": "*",
        "__v": 0,
        "id": "*"
      }
    ]
    """
