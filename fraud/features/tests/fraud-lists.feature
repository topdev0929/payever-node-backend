@management-fraud-lists
Feature: management fraud lists
  Background:
    Given I use DB fixture "business"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "clientId": "de9d1a9f-0c4e-4ebc-ae98-bc2bace0605c",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "merchant",
          "permissions": [
            {
              "acls": [],
              "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced"
            }
          ]
        }
      ]
    }
    """
    Given I remember as "fraudListId" following value:
    """
    "71d15d86-7d1d-4178-b0c8-1d4e1230b2c0"
    """
    Given I remember as "businessId" following value:
    """
    "02c50fb6-3fbe-4941-81bc-f3ecceed9ced"
    """

  Scenario: Create fraud list
    When I send a POST request to "/api/business/{{businessId}}/fraud/lists" with json:
    """
      {
        "name": "Trusted Emails",
        "type": "email",
        "description": "Trusted Emails description",
        "values": [
          "newemail1@email.com",
          "newemail2@email.com",
          "newemail3@email.com"
        ]
      }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "values": [
        "newemail1@email.com",
        "newemail2@email.com",
        "newemail3@email.com"
      ],
      "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced",
      "name": "Trusted Emails",
      "description": "Trusted Emails description",
      "type": "email",
      "_id": "*",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Create fraud list, business not found

    When I send a POST request to "/api/business/some-business-id/fraud/lists" with json:
    """
    {
      "name": "Trusted Emails",
      "type": "email",
      "description": "Trusted Emails description",
      "values": [
        "trusted1@email.com",
        "trusted2@email.com",
        "trusted3@email.com"
      ]
    }
    """
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "message": "app.employee-permission.insufficient.error",
      "error": "Forbidden"
    }
    """

  Scenario: Update fraud list
    Given I use DB fixture "fraud-list"
    When I send a PATCH request to "/api/business/{{businessId}}/fraud/lists/{{fraudListId}}" with json:
    """
    {
      "name": "Trusted Emails",
      "type": "email",
      "description": "Trusted Emails description",
      "values": [
        "trusted1@email.com",
        "trusted2@email.com",
        "trusted3@email.com",
        "new@email.com"
      ]
    }
    """
    Then print last response
    And the response status code should be 202
    And the response should contain json:
    """
    {
      "values": [
        "trusted1@email.com",
        "trusted2@email.com",
        "trusted3@email.com",
        "new@email.com"
      ],
      "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced",
      "name": "Trusted Emails",
      "description": "Trusted Emails description",
      "type": "email",
      "_id": "{{fraudListId}}",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Delete fraudList
    Given I use DB fixture "fraud-list"
    When I send a DELETE request to "/api/business/{{businessId}}/fraud/lists/{{fraudListId}}"
    Then print last response
    And the response status code should be 202
    Then model "FraudList" with id "{{fraudListId}}" should not exist


  Scenario: Get fraud list
    Given I use DB fixture "fraud-list"
    When I send a GET request to "/api/business/{{businessId}}/fraud/lists/{{fraudListId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "values": [
        "trusted1@email.com",
        "trusted2@email.com",
        "trusted3@email.com"
      ],
      "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced",
      "name": "Trusted Emails",
      "description": "Trusted Emails description",
      "type": "email",
      "_id": "{{fraudListId}}",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Get list of fraud lists
    Given I use DB fixture "fraud-list"
    When I send a GET request to "/api/business/{{businessId}}/fraud/lists"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "pageSize": 10,
      "lists": [
        {
          "values": [
            "trusted1@email.com",
            "trusted2@email.com",
            "trusted3@email.com"
          ],
          "_id": "71d15d86-7d1d-4178-b0c8-1d4e1230b2c0",
          "name": "Trusted Emails",
          "type": "email",
          "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced",
          "description": "Trusted Emails description",
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0
        },
        {
          "values": [
            "blocked1@email.com",
            "blocked2@email.com",
            "blocked3@email.com"
          ],
          "_id": "a016f1c7-c27a-4343-a7d8-be6002c98b6c",
          "name": "Blocked Emails",
          "type": "email",
          "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced",
          "description": "Trusted Emails description",
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 0
        }
      ],
      "total": 2,
      "totalPages": 1
    }
    """
