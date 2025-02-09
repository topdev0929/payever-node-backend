Feature: Group controller
  Background: 
    Given I remember as "businessId" following value:
      """
      "88038e2a-90f9-11e9-a492-7200004fe4c0"
      """
    Given I remember as "businessIdTwo" following value:
      """
      "af94664f-087f-43f8-97bf-4d2205bedc76"
      """
    Given I remember as "employeeId4" following value:
      """
      "00163dbf-19e0-4cdb-a7e5-61b0bad5883f"
      """
    Given I remember as "employeeIdNew" following value:
      """
      "rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr"
      """
    Given I remember as "employeeId5" following value:
      """
      "8a13bd00-90f1-11e9-9f67-7200004fe4c2"
      """
    Given I use DB fixture "employee"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [
          {
            "name": "user",
            "permissions": [{"businessId": "{{businessId}}", "acls": []}, 
                            {"businessId": "af94664f-087f-43f8-97bf-4d2205bedc76", "acls": []}]
          },
          {
            "name": "merchant",
            "permissions": [{"businessId": "{{businessId}}", "acls": []}, 
                            {"businessId": "af94664f-087f-43f8-97bf-4d2205bedc76", "acls": []}]
          }
        ]
      }
      """
    Given I mock RPC request "users.rpc.employee.created" to "users.rpc.employee.created" with:
      """
      {
        "requestPayload": "*",
        "responsePayload": [{ "success": true }]
      }
      """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "*/api/employees/business/{{businessId}}/get-acls/{{employeeId4}}",
        "headers": {
          "Accept": "application/json, text/plain, */*"
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

  Scenario: Get employee
    When I send a GET request to "/employees/{{businessId}}?page=1&limit=1"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "count": 7,
        "data": [
          {
            "_id": "{{employeeId5}}",
            "email": "email@test.com",
            "firstName":"*",
            "lastName":"*",
            "positions": [
              {
                "businessId": "{{businessId}}",
                "status": 1,
                "positionType": "Admin"
              }
            ],
            "email_i": "email@test.com",
            "status": "1",
            "nameAndEmail": "email@test.com"
          }
        ]
      }
      """

  Scenario: Get employee by id
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c1",
        "roles": [
          {
            "name": "user",
            "permissions": [{"businessId": "{{businessId}}", "acls": []}]
          },
          {
            "name": "merchant",
            "permissions": [{"businessId": "{{businessId}}", "acls": []}]
          }
        ]
      }
      """
    When I send a GET request to "/employees/{{businessId}}/user/8a13bd00-90f1-11e9-9f67-7200004fe4c1"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "_id": "{{employeeId5}}",
          "email": "email@test.com",
          "userId": "8a13bd00-90f1-11e9-9f67-7200004fe4c1",
          "positions": [
            {
              "businessId": "{{businessId}}",
              "status": 1,
              "positionType": "Admin"
            },
            {
              "businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
              "status": 1,
              "positionType": "Admin"
            }
          ],
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0,
          "id": "{{employeeId5}}"
        }
      }
      """

  Scenario: Get employee By id
    When I send a GET request to "/employees/{{businessId}}/{{employeeId5}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
          "data":
            {
              "_id": "{{employeeId5}}",
              "email": "email@test.com",
              "userId": "8a13bd00-90f1-11e9-9f67-7200004fe4c1",
              "positions": [
                {
                  "businessId": "{{businessId}}",
                  "status": 1,
                  "positionType": "Admin"
                }
              ]
            }
         }
      """

  Scenario: Get employee By id
    When I send a GET request to "/employees/{{businessId}}/count?email=email@test.com"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       1
      """

  Scenario: update employee By id
    When I send a PATCH request to "/employees/{{businessId}}/2a13bd00-90f1-11e9-9f67-7200003f86c9" with json:
      """
        {
          "status": 1,
          "email": "empltest@test.com",
          "position": "Admin"
        }
      """
      And print last response
      Then the response status code should be 200
      And the response should contain json:
        """
        {
          "_id": "2a13bd00-90f1-11e9-9f67-7200003f86c9",
          "email": "empltest@test.com",
          "positions": [
            {
              "businessId": "{{businessId}}",
              "status": 1,
              "positionType": "Admin"
            }
          ],
          "id": "2a13bd00-90f1-11e9-9f67-7200003f86c9"
        }
        """
    When I send a PATCH request to "/employees/{{businessId}}/{{employeeId5}}" with json:
      """
      {
        "status": 1,
        "firstName": "Admin",
        "lastName": "test curl",
        "email": "email@test.com",
        "position": "Admin",
        "acls": [
          {
            "microservice": "statistics",
            "create": false,
            "read": false,
            "update": false,
            "delete": false
          }
        ]
      }
      """
      And print last response
      Then the response status code should be 400
      And the response should contain json:
        """
          {
            "errors": "You attempted to modify your own information/permissions, which is not allowed.",
            "message": "Validation failed",
            "statusCode": 400
          }
        """
    When I send a PATCH request to "/employees/{{businessId}}/{{employeeId5}}" with json:
      """
      {
        "status": 1,
        "firstName": "AdminTest",
        "lastName": "test curly",
        "email": "email@test.com",
        "position": "Admin"
      }
      """
      And print last response
      Then the response status code should be 400
      And the response should contain json:
        """
          {
            "errors": "You attempted to modify your own information/permissions, which is not allowed.",
            "message": "Validation failed",
            "statusCode": 400
          }
        """

  Scenario: update employee By id - downgrade admin position
    When I send a PATCH request to "/employees/{{businessId}}/{{employeeId4}}" with json:
      """
        {
          "status": 1,
          "email": "employeeuser4@test.com",
          "position": "Staff"
        }
      """
      And print last response
      Then the response status code should be 400
      And the response should contain json:
        """
          {
            "errors": "You cannot change admin position",
            "message": "Validation failed",
            "statusCode": 400
         }
        """

  Scenario: update employee By id - change admin access
    When I send a PATCH request to "/employees/{{businessId}}/{{employeeId4}}" with json:
      """
        {
          "status": 1,
          "email": "employeeuser4@test.com",
          "position": "Admin",
          "acls": [
            {
              "microservice": "pos",
              "create": false,
              "read": false,
              "update": false,
              "delete": false
            }
          ]
        }
      """
      And print last response
      Then the response status code should be 400
      And the response should contain json:
        """
        {
          "errors": "You cannot change admin access",
          "message": "Validation failed",
          "statusCode": 400
        }
        """

  Scenario: update employee By id
    When I send a PATCH request to "/employees/{{businessId}}/{{employeeId5}}" with json:
    """
    {
      "status": 1,
      "firstName": "test",
      "lastName": "test",
      "email": "email@testteste.com",
      "position": "Admin"
    }
    """
    And print last response
    Then the response status code should be 400
    And the response should contain json:
      """
      {
        "errors": "User can not change employee email",
        "message": "Validation failed",
        "statusCode": 400
      }
      """

  Scenario: create employee
    When I send a POST request to "/employees/{{businessId}}" with json:
    """
    {
      "_id": "{{employeeIdNew}}",
      "logo": null,
      "status": 1,
      "firstName": "Admin",
      "lastName": "test curl",
      "email": "Testtegea@testdomen.in",
      "position": "Admin",
      "groups": null,
      "acls": [
        {
          "microservice": "statistics",
          "create": false,
          "read": false,
          "update": false,
          "delete": false
        }
      ],
      "phoneNumber": null,
      "companyName": "Comp",
      "address": {
        "country": null,
        "city": null,
        "state": null,
        "street": null,
        "zipCode": null
      }
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
          "isVerified": false,
          "logo": null,
          "firstName": "Admin",
          "lastName": "test curl",
          "email": "testtegea@testdomen.in",
          "phoneNumber": null,
          "companyName": "Comp",
          "address": {
            "country": null,
            "city": null,
            "state": null,
            "street": null,
            "zipCode": null
          },
          "positions": [
            {
              "businessId": "{{businessId}}",
              "positionType": "Admin",
              "status": 1
            }
          ],
          "_id": "*",
          "fullName": "Admin test curl",
          "id": "*"
        }
      """
    Then I look for model "Employee" by following JSON and remember as "resEmployees":
      """
      {
        "_id": ["{{employeeIdNew}}"]
      }
      """
    And print storage key "resEmployees"
    And stored value "resEmployees" should contain json:
    """
      {
         "_id": "{{employeeIdNew}}",
         "isVerified": false,
         "logo": null,
         "email": "testtegea@testdomen.in",
         "phoneNumber": null,
         "companyName": "Comp",
         "address": {
           "country": null,
           "city": null,
           "state": null,
           "street": null,
           "zipCode": null
         },
         "firstName": "Admin",
         "lastName": "test curl",
         "language": "en",
         "positions": [
           {
             "businessId": "{{businessId}}",
             "positionType": "Admin",
             "status": 1
           }
         ],
         "userId": null,
         "createdAt": "*",
         "updatedAt": "*",
         "__v": 0
       }
    """
    Then I look for model "Employeedetail" by following JSON and remember as "resEmployeeDetail":
      """
      {
        "employeeId": ["{{employeeIdNew}}"]
      }
      """
    And print storage key "resEmployeeDetail"
    And stored value "resEmployeeDetail" should contain json:
    """
      {
         "_id": "*",
         "deleted": false,
         "userId": null,
         "firstName": "Admin",
         "lastName": "test curl",
         "employeeId": "{{employeeIdNew}}",
         "companyName": "Comp",
         "phoneNumber": null,
         "address": {
           "country": null,
           "city": null,
           "state": null,
           "street": null,
           "zipCode": null
         },
         "position": {
           "businessId": "{{businessId}}",
           "positionType": "Admin",
           "status": 1
         },
         "language": "en",
         "logo": null,
         "isActive": true,
         "createdAt": "*",
         "updatedAt": "*",
         "__v": 0
       }
    """
  Scenario: update employee name By id (employee detail)
    When I send a PATCH request to "/employees/{{businessId}}/8a13bd00-90f1-11e9-9f67-bbbbbbbbbbbb" with json:
    """
    {
      "status": 1,
      "firstName": "new FirstName",
      "lastName": "New LastName",
      "email": "bbbbbbbbbbbb@test.com",
      "position": "Admin"
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
          "deleted": false,
          "_id": "8a13bd00-90f1-11e9-9f67-bbbbbbbbbbbb",
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0,
          "firstName": "new FirstName",
          "lastName": "New LastName",
          "fullName": "new FirstName New LastName",
          "id": "8a13bd00-90f1-11e9-9f67-bbbbbbbbbbbb",
          "email": "bbbbbbbbbbbb@test.com",
          "positions": [
            {
              "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
              "status": 1,
              "positionType": "Admin"
            },
            {
              "businessId": "df4c7b7b-c33e-4643-810f-c50420cbeebc",
              "status": 1,
              "positionType": "Admin"
            },
            {
              "businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
              "status": 1,
              "positionType": "Admin"
            }
          ]
        }
      """
    Then I look for model "Employeedetail" by following JSON and remember as "resEmployeeDetail2":
      """
      {
        "employeeId": ["8a13bd00-90f1-11e9-9f67-bbbbbbbbbbbb"]
      }
      """
    And print storage key "resEmployeeDetail2"
    And stored value "resEmployeeDetail2" should contain json:
    """
      {
        "_id": "*",
        "firstName": "new FirstName",
        "lastName": "New LastName",
        "employeeId": "8a13bd00-90f1-11e9-9f67-bbbbbbbbbbbb"
       }
    """
  Scenario: create employee with owner email
    When I send a POST request to "/employees/{{businessIdTwo}}" with json:
    """
    {
      "logo": null,
      "status": 1,
      "firstName": "Admin",
      "lastName": "test curl",
      "email": "owner-admin@testdomen.in",
      "position": "Admin",
      "groups": null,
      "acls": [
        {
          "microservice": "statistics",
          "create": false,
          "read": false,
          "update": false,
          "delete": false
        }
      ],
      "phoneNumber": null,
      "companyName": "Comp",
      "address": {
        "country": null,
        "city": null,
        "state": null,
        "street": null,
        "zipCode": null
      }
    }
    """
    And print last response
    Then the response status code should be 400
    And the response should contain json:
      """
        {
          "errors": "You're trying to add the owner of the business as an employee, which is strictly prohibited! Please don't do it.",
          "message": "Validation failed",
          "statusCode": 400
        }
      """

  Scenario: delete employee By id (employee detail)
    When I send a DELETE request to "/employees/{{businessId}}/8a13bd00-90f1-11e9-9f67-cccccccccccc"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "8a13bd00-90f1-11e9-9f67-cccccccccccc",
        "email": "cccccccccccccc@test.com",
        "positions": [],
        "createdAt": "*",
        "updatedAt": "*",
        "__v": 0,
        "id": "8a13bd00-90f1-11e9-9f67-cccccccccccc"
      }
    """
    Then I look for model "Employeedetail" by following JSON and remember as "resEmployeeDetail3":
      """
      {
        "employeeId": "8a13bd00-90f1-11e9-9f67-cccccccccccc"
      }
      """
    And print storage key "resEmployeeDetail3"
    And stored value "resEmployeeDetail3" should contain json:
    """
      {
        "deleted":true
      }
    """
  
  Scenario: delete employee By id
    When I look for model "BusinessActive" by following JSON and remember as "resBusinessActive":
    """
    {
      "_id":"2fe2f639-3db9-4718-933b-d9b452ed3502"
    }
    """
    And print storage key "resBusinessActive"
    And stored value "resBusinessActive" should contain json:
    """
      {
        "_id": "2fe2f639-3db9-4718-933b-d9b452ed3502",
        "owner": "dbeb5d9d-e55e-44b2-gggg-gggggggggggg",
        "__v": 0,
        "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
        "createdAt": "*",
        "updatedAt": "*"
      }
    """
    Then I send a DELETE request to "/employees/{{businessId}}/bc7d3532-605c-4d07-ba9f-31105466423b"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "bc7d3532-605c-4d07-ba9f-31105466423b",
      "email": "employeeuser5@test.com",
      "createdAt": "*",
      "updatedAt": "*",
      "__v": 0
    }
    """
    And I look for model "BusinessActive" by following JSON and remember as "resBusinessActive1":
    """
    {
      "_id":"2fe2f639-3db9-4718-933b-d9b452ed3502"
    }
    """
    And print storage key "resBusinessActive1"
    And stored value "resBusinessActive1" should be equal to value :
    """
    null
    """

  Scenario: delete employee By himself
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c1",
        "roles": [
          {
            "name": "user",
            "permissions": [{"businessId": "{{businessId}}", "acls": []}]
          },
          {
            "name": "merchant",
            "permissions": [{"businessId": "{{businessId}}", "acls": []}]
          }
        ]
      }
      """
    When I send a DELETE request to "/employees/{{businessId}}/{{employeeId5}}"
    And print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "message": "You cannot remove yourself",
      "statusCode": 403
    }
    """

  Scenario: Bulk employee import 
    Given I attach the file "employee-import.csv" to "file"
    When I send a POST request to "/employees/{{businessId}}/bulk-create" with form data:
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
            "businessId": "{{businessId}}",
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
            "businessId": "{{businessId}}",
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

  Scenario: Upsert employee
    When I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "auth.event.employee.register",
        "payload": {
          "employee": {
            "email": "robb2@intveld.com"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_users_micro" channel
    And look for model "Employee" by following JSON and remember as "employee":
      """
      { "email": "robb2@intveld.com" }
      """
    And stored value "employee" should contain json:
      """
      { 
        "_id": "*",
        "email": "robb2@intveld.com"
      }
      """

  Scenario: delete an employee and add again
    When I send a DELETE request to "/employees/{{businessId}}/00162dbf-19e0-4cdb-a7e5-61b0bad5883f"
    And I process messages from RabbitMQ "async_events_users_micro" channel
    When I send a POST request to "/employees/{{businessId}}" with json:
    """
    {
      "logo": null,
      "status": 1,
      "firstName": "test firstname 2",
      "lastName": "test lastname 2",
      "email": "employeeuser3@test.com",
      "position": "Admin",
      "groups": null,
      "acls": [
        {
          "microservice": "statistics",
          "create": false,
          "read": false,
          "update": false,
          "delete": false
        }
      ],
      "phoneNumber": null,
      "companyName": "Comp",
      "address": {
        "country": null,
        "city": null,
        "state": null,
        "street": null,
        "zipCode": null
      }
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "address": {
          "country": null,
          "city": null,
          "state": null,
          "street": null,
          "zipCode": null
        },
        "_id": "00162dbf-19e0-4cdb-a7e5-61b0bad5883f",
        "email": "employeeuser3@test.com",
        "positions": [
          {
            "businessId": "{{businessId}}",
            "positionType": "Admin",
            "status": 1
          }
        ],
        "createdAt": "*",
        "updatedAt": "*",
        "__v": 0,
        "companyName": "Comp",
        "logo": null,
        "phoneNumber": null,
        "userId": null,
        "id": "00162dbf-19e0-4cdb-a7e5-61b0bad5883f"
      }
      """
